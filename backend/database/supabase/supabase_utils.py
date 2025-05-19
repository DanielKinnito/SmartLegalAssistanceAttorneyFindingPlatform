#!/usr/bin/env python3
"""
Utility script for working with Supabase PostgreSQL database.
Provides helpful functions for common database operations.
"""
import os
import sys
import json
import argparse
from connect_supabase import connect_to_supabase, run_custom_query, load_environment

def list_tables():
    """List all tables in the database"""
    query = """
    SELECT 
        table_name, 
        (SELECT count(*) FROM information_schema.columns WHERE table_name = t.table_name) AS column_count,
        obj_description((quote_ident(table_name))::regclass) as description
    FROM 
        information_schema.tables t
    WHERE 
        table_schema = 'public'
    ORDER BY 
        table_name;
    """
    
    result = run_custom_query(query)
    if not result:
        return False
    
    print("\n===== DATABASE TABLES =====")
    for i, row in enumerate(result['rows']):
        table_name, column_count, description = row
        print(f"{i+1}. {table_name} ({column_count} columns)")
        if description:
            print(f"   Description: {description}")
    
    return True

def describe_table(table_name):
    """Describe a specific table structure"""
    # Validate table name to prevent SQL injection
    if not table_name.isalnum() and not '_' in table_name:
        print(f"❌ Invalid table name: {table_name}")
        return False
    
    query = f"""
    SELECT 
        column_name, 
        data_type, 
        is_nullable, 
        column_default,
        col_description((table_schema || '.' || table_name)::regclass::oid, ordinal_position) as description
    FROM 
        information_schema.columns
    WHERE 
        table_schema = 'public' AND table_name = '{table_name}'
    ORDER BY 
        ordinal_position;
    """
    
    result = run_custom_query(query)
    if not result or not result['rows']:
        print(f"❌ Table '{table_name}' not found or error retrieving structure")
        return False
    
    print(f"\n===== TABLE: {table_name} =====")
    print("Column Name".ljust(25) + "Data Type".ljust(20) + "Nullable".ljust(10) + "Default".ljust(20) + "Description")
    print("-" * 100)
    
    for row in result['rows']:
        column_name, data_type, is_nullable, default, description = row
        is_nullable_str = "YES" if is_nullable == "YES" else "NO"
        default_str = str(default) if default else ""
        description_str = str(description) if description else ""
        
        print(f"{column_name.ljust(25)}{data_type.ljust(20)}{is_nullable_str.ljust(10)}{default_str[:19].ljust(20)}{description_str}")
    
    # Get foreign keys
    query_fk = f"""
    SELECT
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
    FROM
        information_schema.table_constraints AS tc
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
          AND tc.table_schema = kcu.table_schema
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
          AND ccu.table_schema = tc.table_schema
    WHERE
        tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_name = '{table_name}';
    """
    
    fk_result = run_custom_query(query_fk)
    if fk_result and fk_result['rows']:
        print("\nForeign Keys:")
        for row in fk_result['rows']:
            column_name, foreign_table, foreign_column = row
            print(f"  {column_name} → {foreign_table}.{foreign_column}")
    
    return True

def query_table(table_name, limit=10, where=None, order_by=None):
    """Query data from a specific table"""
    # Validate table name to prevent SQL injection
    if not table_name.isalnum() and not '_' in table_name:
        print(f"❌ Invalid table name: {table_name}")
        return False
    
    # Build query
    query = f"SELECT * FROM {table_name}"
    
    if where:
        query += f" WHERE {where}"
    
    if order_by:
        query += f" ORDER BY {order_by}"
    
    query += f" LIMIT {limit}"
    
    # Execute query
    result = run_custom_query(query)
    if not result:
        return False
    
    if not result['rows']:
        print(f"No data found in table '{table_name}' with the given criteria")
        return True
    
    # Print results in a nice format
    columns = result['columns']
    rows = result['rows']
    
    # Determine column widths (max of column name and data width)
    col_widths = [len(col) for col in columns]
    for row in rows:
        for i, cell in enumerate(row):
            cell_str = str(cell) if cell is not None else 'NULL'
            col_widths[i] = max(col_widths[i], min(len(cell_str), 30))
    
    # Print header
    header = " | ".join(col.ljust(col_widths[i]) for i, col in enumerate(columns))
    print("\n" + header)
    print("-" * len(header))
    
    # Print rows
    for row in rows:
        row_str = " | ".join(
            (str(cell) if cell is not None else 'NULL')[:30].ljust(col_widths[i]) 
            for i, cell in enumerate(row)
        )
        print(row_str)
    
    print(f"\nTotal rows: {len(rows)}")
    return True

def export_data(table_name=None, output_file=None, format='json'):
    """Export data from database to file"""
    if not table_name:
        query = """
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
        ORDER BY table_name;
        """
        tables_result = run_custom_query(query)
        if not tables_result or not tables_result['rows']:
            print("❌ No tables found in the database")
            return False
        
        # Export all tables
        data = {}
        for row in tables_result['rows']:
            table = row[0]
            query = f"SELECT * FROM {table}"
            result = run_custom_query(query)
            if result and result['rows']:
                data[table] = {
                    'columns': result['columns'],
                    'rows': [list(row) for row in result['rows']]
                }
    else:
        # Export single table
        query = f"SELECT * FROM {table_name}"
        result = run_custom_query(query)
        if not result:
            return False
        
        data = {
            table_name: {
                'columns': result['columns'],
                'rows': [list(row) for row in result['rows']]
            }
        }
    
    # Prepare output
    if not output_file:
        table_part = table_name if table_name else 'all_tables'
        output_file = f"supabase_export_{table_part}.{format}"
    
    # Convert data for JSON serialization
    for table in data.values():
        for i, row in enumerate(table['rows']):
            for j, value in enumerate(row):
                # Handle non-serializable types
                if isinstance(value, (bytes, bytearray)):
                    table['rows'][i][j] = str(value)
    
    # Write to file
    with open(output_file, 'w') as f:
        if format == 'json':
            json.dump(data, f, indent=2, default=str)
        else:
            # Simple CSV export for single table
            if len(data) == 1:
                table_data = list(data.values())[0]
                f.write(','.join(table_data['columns']) + '\n')
                for row in table_data['rows']:
                    f.write(','.join(str(val).replace(',', '\\,') for val in row) + '\n')
            else:
                print("❌ CSV export only supports single table export")
                return False
    
    print(f"✅ Data exported to {output_file}")
    return True

def main():
    parser = argparse.ArgumentParser(description='Supabase PostgreSQL Database Utilities')
    subparsers = parser.add_subparsers(dest='command', help='Command to run')
    
    # List tables command
    subparsers.add_parser('list-tables', help='List all tables in the database')
    
    # Describe table command
    describe_parser = subparsers.add_parser('describe', help='Describe a specific table')
    describe_parser.add_argument('table', help='Table name to describe')
    
    # Query table command
    query_parser = subparsers.add_parser('query', help='Query data from a table')
    query_parser.add_argument('table', help='Table name to query')
    query_parser.add_argument('--limit', type=int, default=10, help='Maximum number of rows to return')
    query_parser.add_argument('--where', help='WHERE clause for the query')
    query_parser.add_argument('--order-by', help='ORDER BY clause for the query')
    
    # Export data command
    export_parser = subparsers.add_parser('export', help='Export data to file')
    export_parser.add_argument('--table', help='Table name to export (omit for all tables)')
    export_parser.add_argument('--output', help='Output file name')
    export_parser.add_argument('--format', choices=['json', 'csv'], default='json', help='Output format')
    
    # Custom query command
    custom_parser = subparsers.add_parser('custom', help='Run a custom SQL query')
    custom_parser.add_argument('query', help='SQL query to execute')
    
    # Parse arguments
    args = parser.parse_args()
    
    # Load environment variables
    if not load_environment():
        return 1
    
    # Execute the appropriate command
    if args.command == 'list-tables':
        if not list_tables():
            return 1
    
    elif args.command == 'describe':
        if not describe_table(args.table):
            return 1
    
    elif args.command == 'query':
        if not query_table(args.table, args.limit, args.where, args.order_by):
            return 1
    
    elif args.command == 'export':
        if not export_data(args.table, args.output, args.format):
            return 1
    
    elif args.command == 'custom':
        result = run_custom_query(args.query)
        if not result:
            return 1
        
        if 'rows' in result:
            if not result['rows']:
                print("Query executed successfully, but returned no results.")
            else:
                if 'columns' in result:
                    print(','.join(result['columns']))
                for row in result['rows']:
                    print(row)
                print(f"\nTotal rows: {len(result['rows'])}")
        else:
            print(f"Query executed successfully. Affected rows: {result.get('affected_rows', 0)}")
    
    else:
        parser.print_help()
    
    return 0

if __name__ == "__main__":
    sys.exit(main()) 
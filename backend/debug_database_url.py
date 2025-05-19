#!/usr/bin/env python
import os
import sys
import urllib.parse
import dj_database_url

def debug_database_url():
    """Debug the DATABASE_URL formatting and parsing issues."""
    # Get the database URL from environment
    database_url = os.environ.get('DATABASE_URL', '')
    
    print("=" * 60)
    print("DATABASE URL DEBUGGING TOOL")
    print("=" * 60)
    
    if not database_url:
        print("ERROR: No DATABASE_URL found in environment variables")
        return
    
    # Show the original URL with credential masking
    masked_url = database_url
    if '@' in database_url:
        try:
            prefix_part = database_url.split('@')[0]
            masked_url = database_url.replace(prefix_part, '***')
        except:
            masked_url = "***"
    
    print(f"Original DATABASE_URL: {masked_url}")
    
    # Check for common formatting issues
    issues_found = []
    
    # Check for DATABASE_URL= prefix
    if database_url.startswith('DATABASE_URL='):
        issues_found.append("DATABASE_URL contains 'DATABASE_URL=' prefix")
        prefix_fixed_url = database_url[len('DATABASE_URL='):]
        print(f"Fixed URL (prefix): {prefix_fixed_url.replace(prefix_fixed_url.split('@')[0] if '@' in prefix_fixed_url else prefix_fixed_url, '***')}")
        database_url = prefix_fixed_url
    
    # Check for proper scheme
    if not (database_url.startswith('postgresql://') or database_url.startswith('postgres://')):
        if database_url.startswith('postgresql:') and not database_url.startswith('postgresql://'):
            issues_found.append("DATABASE_URL has improper scheme format (postgresql: without //)")
            scheme_fixed_url = database_url.replace('postgresql:', 'postgresql://')
            print(f"Fixed URL (scheme): {scheme_fixed_url.replace(scheme_fixed_url.split('@')[0] if '@' in scheme_fixed_url else scheme_fixed_url, '***')}")
            database_url = scheme_fixed_url
        elif database_url.startswith('postgres:') and not database_url.startswith('postgres://'):
            issues_found.append("DATABASE_URL has improper scheme format (postgres: without //)")
            scheme_fixed_url = database_url.replace('postgres:', 'postgres://')
            print(f"Fixed URL (scheme): {scheme_fixed_url.replace(scheme_fixed_url.split('@')[0] if '@' in scheme_fixed_url else scheme_fixed_url, '***')}")
            database_url = scheme_fixed_url
        elif '@' in database_url and not database_url.startswith('postgresql:') and not database_url.startswith('postgres:'):
            issues_found.append("DATABASE_URL is missing scheme completely")
            scheme_fixed_url = 'postgresql://' + database_url
            print(f"Fixed URL (scheme): {scheme_fixed_url.replace(scheme_fixed_url.split('@')[0] if '@' in scheme_fixed_url else scheme_fixed_url, '***')}")
            database_url = scheme_fixed_url
    
    # Parse and validate URL components
    try:
        parsed_url = urllib.parse.urlparse(database_url)
        print(f"Parsed URL components:")
        print(f"  Scheme: {parsed_url.scheme}")
        print(f"  Username: {'Present' if parsed_url.username else 'Missing'}")
        print(f"  Password: {'Present' if parsed_url.password else 'Missing'}")
        print(f"  Hostname: {parsed_url.hostname}")
        print(f"  Port: {parsed_url.port}")
        print(f"  Path: {parsed_url.path}")
        
        if parsed_url.scheme not in ('postgres', 'postgresql'):
            issues_found.append(f"Invalid scheme: {parsed_url.scheme}")
        
        if not parsed_url.hostname:
            issues_found.append("Missing hostname")
        
        if not parsed_url.username:
            issues_found.append("Missing username")
        
        if not parsed_url.password:
            issues_found.append("Missing password")
    except Exception as e:
        print(f"Error parsing URL: {e}")
        issues_found.append(f"URL parsing error: {e}")
    
    # Try to process with dj_database_url
    try:
        db_config = dj_database_url.config(default=database_url)
        print("\nDatabase configuration parsed by dj_database_url:")
        print(f"  ENGINE: {db_config.get('ENGINE', 'Not set')}")
        print(f"  NAME: {db_config.get('NAME', 'Not set')}")
        print(f"  USER: {db_config.get('USER', 'Not set')}")
        print(f"  HOST: {db_config.get('HOST', 'Not set')}")
        print(f"  PORT: {db_config.get('PORT', 'Not set')}")
    except Exception as e:
        print(f"\nError in dj_database_url parsing: {e}")
        issues_found.append(f"dj_database_url error: {e}")
    
    # Summary
    print("\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)
    
    if issues_found:
        print("Issues found:")
        for i, issue in enumerate(issues_found, 1):
            print(f"{i}. {issue}")
        print("\nRecommendation: Use the fixed URL format shown above.")
    else:
        print("✅ No formatting issues found with DATABASE_URL")
    
    print("\nTo set the correct DATABASE_URL in your environment, run:")
    print(f"export DATABASE_URL=\"{database_url.replace(database_url.split('@')[0] if '@' in database_url else database_url, '[USERNAME:PASSWORD]')}\"")
    print("\nFor Render.com, add this as an environment variable in your service settings.")

if __name__ == "__main__":
    debug_database_url() 
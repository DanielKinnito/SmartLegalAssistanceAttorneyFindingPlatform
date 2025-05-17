# Integrating Django Models with Supabase Schema

This guide explains how to make your existing Django models work with the pre-created Supabase schema.

## The Important Parts

When using a pre-created database schema, the most important part of your Django models is the `Meta` class with the correct `db_table` attribute.

## Model Integration Examples

Here are examples of how your Django models should be structured:

### User Model

```python
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models

class User(AbstractBaseUser, PermissionsMixin):
    # Fields
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    # Other fields...
    
    class Meta:
        db_table = 'auth_user'  # Match the table name in Supabase
```

### Attorney Model

```python
class Attorney(models.Model):
    # Fields
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='attorney_details')
    # Other fields...
    
    class Meta:
        db_table = 'attorneys'  # Match the table name in Supabase
```

### Client Model

```python
class Client(models.Model):
    # Fields
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='client_details')
    # Other fields...
    
    class Meta:
        db_table = 'clients'  # Match the table name in Supabase
```

## Many-to-Many Relationships

For many-to-many relationships with custom join tables like we have for attorney specialties:

```python
class Specialty(models.Model):
    # Fields
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, unique=True)
    # Other fields...
    
    class Meta:
        db_table = 'attorney_specialties'
        
class Attorney(models.Model):
    # Fields
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    specialties = models.ManyToManyField(
        Specialty,
        related_name='attorneys',
        through='AttorneySpecialtyRelationship'
    )
    # Other fields...
    
    class Meta:
        db_table = 'attorneys'
        
class AttorneySpecialtyRelationship(models.Model):
    attorney = models.ForeignKey(Attorney, on_delete=models.CASCADE)
    specialty = models.ForeignKey(Specialty, on_delete=models.CASCADE)
    
    class Meta:
        db_table = 'attorney_specialties_rel'
        unique_together = ['attorney', 'specialty']
```

## Important Note on Auto-Created Fields

Django automatically creates an `id` field as a primary key if you don't specify one. Since our Supabase schema has explicit UUID primary keys, make sure each model has:

```python
id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
```

## Working with JSON Fields

For the Supabase schema, we used JSONB for storing JSON data. In your Django models, use:

```python
details = models.JSONField(blank=True, null=True)
```

## File Fields with Supabase Storage

When using Supabase Storage for file uploads, define your file fields like this:

```python
document = models.FileField(
    upload_to='attorney_credentials/', 
    storage=SupabaseStorage()  # If you created a custom storage class
)
```

## What About Migrations?

Since we're using a pre-created schema, Django migrations won't be needed. We've set the `MIGRATION_MODULES` setting to prevent Django from trying to create tables.

However, if you need to make schema changes in the future:

1. First, update your SQL schema in Supabase using the SQL editor
2. Then update your Django models to match
3. Do not run Django migrations

## Testing Your Models

To test that your models are correctly connecting to the Supabase tables:

```python
# Test that you can query a table
Attorney.objects.all()

# Test that you can create a record
attorney = Attorney.objects.create(
    user=user,
    license_number="LIC12345",
    # other fields...
)

# Test relationships
attorney.specialties.all()
``` 
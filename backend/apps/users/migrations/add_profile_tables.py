from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('users', 'add_email_verification_tokens'),
    ]

    operations = [
        migrations.CreateModel(
            name='ClientProfile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('probono_requested', models.BooleanField(default=False)),
                ('probono_reason', models.TextField(blank=True, null=True)),
                ('income_level', models.CharField(blank=True, max_length=50, null=True)),
                ('probono_document', models.FileField(blank=True, help_text='Document supporting probono request (e.g., income proof)', null=True, upload_to='client_documents/probono/')),
                ('user', models.OneToOneField(on_delete=models.deletion.CASCADE, related_name='client_profile', to='users.user')),
            ],
            options={
                'db_table': 'client_profiles',
            },
        ),
        migrations.CreateModel(
            name='AttorneyProfile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('bar_number', models.CharField(max_length=50)),
                ('practice_areas', models.JSONField(default=list)),
                ('years_of_experience', models.IntegerField(default=0)),
                ('bio', models.TextField(blank=True, null=True)),
                ('accepts_probono', models.BooleanField(default=False)),
                ('license_document', models.FileField(help_text='Legal license or bar membership document', upload_to='attorney_documents/licenses/')),
                ('degree_document', models.FileField(help_text='Law degree or equivalent qualification', upload_to='attorney_documents/degrees/')),
                ('user', models.OneToOneField(on_delete=models.deletion.CASCADE, related_name='attorney_profile', to='users.user')),
            ],
            options={
                'db_table': 'attorney_profiles',
            },
        ),
    ] 
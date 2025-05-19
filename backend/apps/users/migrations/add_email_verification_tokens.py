from django.db import migrations, models
import django.utils.timezone
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('users', 'add_missing_fields'),  # Make sure this is the correct dependency
    ]

    operations = [
        migrations.CreateModel(
            name='EmailVerificationToken',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('token', models.CharField(max_length=255, unique=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('expires_at', models.DateTimeField()),
                ('is_used', models.BooleanField(default=False)),
                ('user', models.ForeignKey(on_delete=models.deletion.CASCADE, related_name='email_verification_tokens', to='users.user')),
            ],
            options={
                'verbose_name': 'email verification token',
                'verbose_name_plural': 'email verification tokens',
                'db_table': 'email_verification_tokens',
            },
        ),
    ] 
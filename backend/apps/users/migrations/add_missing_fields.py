from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='verification_status',
            field=models.CharField(
                choices=[('PENDING', 'Pending Verification'), ('VERIFIED', 'Verified'), ('REJECTED', 'Rejected')],
                default='PENDING',
                max_length=10
            ),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='user',
            name='verification_notes',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='user',
            name='email_verified',
            field=models.BooleanField(default=False),
            preserve_default=True,
        ),
    ] 
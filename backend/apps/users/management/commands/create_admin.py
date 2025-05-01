from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.db import IntegrityError

User = get_user_model()

class Command(BaseCommand):
    help = 'Creates an admin user for the Smart Legal Assistance Platform'

    def add_arguments(self, parser):
        parser.add_argument('--email', type=str, help='Admin email address')
        parser.add_argument('--password', type=str, help='Admin password')
        parser.add_argument('--first_name', type=str, help='Admin first name', default='Admin')
        parser.add_argument('--last_name', type=str, help='Admin last name', default='User')

    def handle(self, *args, **options):
        email = options.get('email')
        password = options.get('password')
        first_name = options.get('first_name')
        last_name = options.get('last_name')

        if not email:
            email = input('Enter admin email address: ')
        
        if not password:
            password = input('Enter admin password: ')
        
        if not first_name:
            first_name = 'Admin'
        
        if not last_name:
            last_name = 'User'
        
        try:
            user = User.objects.create_superuser(
                email=email,
                password=password,
                first_name=first_name,
                last_name=last_name
            )
            self.stdout.write(self.style.SUCCESS(f'Admin user created successfully: {user.email}'))
        except IntegrityError:
            self.stdout.write(self.style.WARNING(f'Admin user with email {email} already exists'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error creating admin user: {str(e)}')) 
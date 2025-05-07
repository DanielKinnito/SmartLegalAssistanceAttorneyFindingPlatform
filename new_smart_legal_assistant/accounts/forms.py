from allauth.account.forms import SignupForm
from django import forms
from accounts.models import CustomUser

class CustomSignupForm(SignupForm):
    role = forms.ChoiceField(choices=CustomUser.ROLE_CHOICES)

    def save(self, request):
        user = super().save(request)
        user.role = self.cleaned_data['role']
        user.save()
        return user
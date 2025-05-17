from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.forms import UserChangeForm, UserCreationForm
from django.utils.translation import gettext_lazy as _
from .models import UserActivity, EmailVerificationToken, ClientProfile, AttorneyProfile

User = get_user_model()

class CustomUserChangeForm(UserChangeForm):
    class Meta(UserChangeForm.Meta):
        model = User
        fields = '__all__'


class CustomUserCreationForm(UserCreationForm):
    class Meta(UserCreationForm.Meta):
        model = User
        fields = ('email',)


class ClientProfileInline(admin.StackedInline):
    model = ClientProfile
    can_delete = False
    verbose_name_plural = 'Client Profile'
    fk_name = 'user'
    readonly_fields = ('probono_document',)


class AttorneyProfileInline(admin.StackedInline):
    model = AttorneyProfile
    can_delete = False
    verbose_name_plural = 'Attorney Profile'
    fk_name = 'user'
    readonly_fields = ('license_document', 'degree_document')


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    form = CustomUserChangeForm
    add_form = CustomUserCreationForm
    
    list_display = ('email', 'first_name', 'last_name', 'user_type', 'verification_status', 'is_active', 'date_joined')
    list_filter = ('user_type', 'verification_status', 'is_active', 'is_staff')
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        (_('Personal info'), {'fields': ('first_name', 'last_name', 'phone_number', 'profile_image')}),
        (_('Status'), {'fields': ('verification_status', 'verification_notes', 'email_verified')}),
        (_('Permissions'), {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        (_('Security'), {'fields': ('mfa_enabled',)}),
        (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2', 'user_type'),
        }),
    )
    search_fields = ('email', 'first_name', 'last_name')
    ordering = ('-date_joined',)
    filter_horizontal = ('groups', 'user_permissions',)
    
    def get_inlines(self, request, obj=None):
        if obj:
            if obj.user_type == 'CLIENT':
                return [ClientProfileInline]
            elif obj.user_type == 'ATTORNEY':
                return [AttorneyProfileInline]
        return []

    def get_readonly_fields(self, request, obj=None):
        if obj:
            return ['email', 'date_joined', 'last_login']
        return []
    
    actions = ['approve_verification', 'reject_verification']
    
    def approve_verification(self, request, queryset):
        queryset.update(verification_status='VERIFIED')
        self.message_user(request, f"{queryset.count()} users have been approved.")
    approve_verification.short_description = "Approve selected users' verification"
    
    def reject_verification(self, request, queryset):
        queryset.update(verification_status='REJECTED')
        self.message_user(request, f"{queryset.count()} users have been rejected.")
    reject_verification.short_description = "Reject selected users' verification"


@admin.register(UserActivity)
class UserActivityAdmin(admin.ModelAdmin):
    list_display = ('user', 'activity_type', 'ip_address', 'timestamp')
    list_filter = ('activity_type', 'timestamp')
    search_fields = ('user__email', 'activity_type', 'ip_address')
    readonly_fields = ('user', 'activity_type', 'ip_address', 'user_agent', 'timestamp', 'details')
    ordering = ('-timestamp',)


@admin.register(EmailVerificationToken)
class EmailVerificationTokenAdmin(admin.ModelAdmin):
    list_display = ('user', 'created_at', 'expires_at', 'is_used')
    list_filter = ('is_used', 'created_at', 'expires_at')
    search_fields = ('user__email', 'token')
    readonly_fields = ('user', 'token', 'created_at', 'expires_at', 'is_used')
    ordering = ('-created_at',)


@admin.register(ClientProfile)
class ClientProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'probono_requested', 'income_level')
    list_filter = ('probono_requested',)
    search_fields = ('user__email', 'user__first_name', 'user__last_name')
    readonly_fields = ('user',)


@admin.register(AttorneyProfile)
class AttorneyProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'bar_number', 'years_of_experience', 'accepts_probono')
    list_filter = ('accepts_probono',)
    search_fields = ('user__email', 'user__first_name', 'user__last_name', 'bar_number')
    readonly_fields = ('user',) 
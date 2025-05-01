"""
API serializers for attorney_service.
"""
from rest_framework import serializers
from .models import Attorney, Specialty, AttorneyCredential

class SpecialtySerializer(serializers.ModelSerializer):
    """
    Serializer for Specialty model.
    """
    class Meta:
        model = Specialty
        fields = ['id', 'name', 'description']


class AttorneyCredentialSerializer(serializers.ModelSerializer):
    """
    Serializer for AttorneyCredential model.
    """
    class Meta:
        model = AttorneyCredential
        fields = ['id', 'document_type', 'document', 'is_verified', 'verified_at', 'uploaded_at']


class AttorneySerializer(serializers.ModelSerializer):
    """
    Serializer for Attorney model.
    """
    specialties = SpecialtySerializer(many=True, read_only=True)
    credentials = AttorneyCredentialSerializer(many=True, read_only=True)
    specialty_ids = serializers.ListField(
        child=serializers.UUIDField(),
        write_only=True,
        required=False
    )
    
    class Meta:
        model = Attorney
        fields = [
            'id', 'user_id', 'license_number', 'license_status', 'specialties', 'specialty_ids',
            'years_of_experience', 'bio', 'education', 'office_address', 'latitude', 'longitude',
            'is_pro_bono', 'ratings_average', 'ratings_count', 'email', 'first_name', 'last_name',
            'credentials'
        ]
        read_only_fields = ['id', 'user_id', 'ratings_average', 'ratings_count']
    
    def create(self, validated_data):
        specialty_ids = validated_data.pop('specialty_ids', [])
        attorney = Attorney.objects.create(**validated_data)
        
        # Add specialties
        if specialty_ids:
            specialties = Specialty.objects.filter(id__in=specialty_ids)
            attorney.specialties.set(specialties)
        
        return attorney
    
    def update(self, instance, validated_data):
        specialty_ids = validated_data.pop('specialty_ids', None)
        
        # Update attorney fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Update specialties if provided
        if specialty_ids is not None:
            specialties = Specialty.objects.filter(id__in=specialty_ids)
            instance.specialties.set(specialties)
        
        return instance 
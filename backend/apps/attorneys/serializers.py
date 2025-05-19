from rest_framework import serializers
from .models import Attorney, Specialty, AttorneyCredential, AvailabilitySlot
from apps.users.serializers import UserSerializer


class SpecialtySerializer(serializers.ModelSerializer):
    class Meta:
        model = Specialty
        fields = ['id', 'name', 'description']
        read_only_fields = ['id']


class AttorneyCredentialSerializer(serializers.ModelSerializer):
    class Meta:
        model = AttorneyCredential
        fields = ['id', 'attorney', 'document_type', 'document', 'is_verified', 
                  'verified_by', 'verified_at', 'uploaded_at']
        read_only_fields = ['id', 'attorney', 'is_verified', 'verified_by', 'verified_at', 'uploaded_at']


class AvailabilitySlotSerializer(serializers.ModelSerializer):
    day_name = serializers.SerializerMethodField()
    
    class Meta:
        model = AvailabilitySlot
        fields = ['id', 'attorney', 'day_of_week', 'day_name', 'start_time', 'end_time', 'is_available']
        read_only_fields = ['id', 'attorney']
    
    def get_day_name(self, obj):
        days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        return days[obj.day_of_week]
    
    def validate(self, data):
        # Ensure end_time is after start_time
        if data.get('start_time') and data.get('end_time') and data['start_time'] >= data['end_time']:
            raise serializers.ValidationError("End time must be after start time")
        return data


class AttorneySerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    specialties = SpecialtySerializer(many=True, read_only=True)
    
    class Meta:
        model = Attorney
        fields = [
            'id', 'user', 'license_number', 'license_status', 'specialties',
            'years_of_experience', 'bio', 'education', 'office_address',
            'latitude', 'longitude', 'is_pro_bono', 'ratings_average', 'ratings_count'
        ]
        read_only_fields = ['id', 'user', 'license_status', 'ratings_average', 'ratings_count']


class AttorneyDetailSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    specialties = SpecialtySerializer(many=True, read_only=True)
    availability = serializers.SerializerMethodField()
    credentials = AttorneyCredentialSerializer(many=True, read_only=True)
    
    class Meta:
        model = Attorney
        fields = [
            'id', 'user', 'license_number', 'license_status', 'specialties',
            'years_of_experience', 'bio', 'education', 'office_address',
            'latitude', 'longitude', 'is_pro_bono', 'ratings_average', 
            'ratings_count', 'availability', 'credentials'
        ]
        read_only_fields = ['id', 'user', 'license_status', 'ratings_average', 'ratings_count']
    
    def get_availability(self, obj):
        availability_slots = obj.availability_slots.all()
        return AvailabilitySlotSerializer(availability_slots, many=True).data


class AttorneyUpdateSerializer(serializers.ModelSerializer):
    specialty_ids = serializers.ListField(
        child=serializers.UUIDField(),
        write_only=True,
        required=False
    )
    
    class Meta:
        model = Attorney
        fields = [
            'bio', 'education', 'office_address', 'latitude', 
            'longitude', 'is_pro_bono', 'years_of_experience', 'specialty_ids'
        ]
    
    def update(self, instance, validated_data):
        specialty_ids = validated_data.pop('specialty_ids', None)
        
        # Update the attorney instance with other fields
        instance = super().update(instance, validated_data)
        
        # Update specialties if provided
        if specialty_ids is not None:
            instance.specialties.clear()
            for specialty_id in specialty_ids:
                try:
                    specialty = Specialty.objects.get(id=specialty_id)
                    instance.specialties.add(specialty)
                except Specialty.DoesNotExist:
                    pass
        
        return instance


class AttorneySearchSerializer(serializers.ModelSerializer):
    user_first_name = serializers.CharField(source='user.first_name', read_only=True)
    user_last_name = serializers.CharField(source='user.last_name', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)
    specialties = SpecialtySerializer(many=True, read_only=True)
    
    class Meta:
        model = Attorney
        fields = [
            'id', 'user_first_name', 'user_last_name', 'user_email',
            'license_number', 'license_status', 'specialties',
            'years_of_experience', 'office_address', 'latitude', 'longitude',
            'is_pro_bono', 'ratings_average', 'ratings_count'
        ] 
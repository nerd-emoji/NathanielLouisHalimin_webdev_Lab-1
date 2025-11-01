from rest_framework import serializers
from .models import DRFPost

class DRFPostSerializer(serializers.ModelSerializer):
    photo = serializers.ImageField(required=False)  # Make it optional for updates
    
    class Meta:
        model = DRFPost
        fields = '__all__'

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # Safely build photo URL — avoid raising if file is missing or storage errors occur
        try:
            if instance.photo and getattr(instance.photo, 'url', None):
                url = instance.photo.url
                request = self.context.get('request')
                representation['photo'] = request.build_absolute_uri(url) if request else url
        except (ValueError, OSError):
            # file missing or storage error; leave photo as None (or remove the key)
            representation['photo'] = None
        return representation
    
    def update(self, instance, validated_data):
        # Handle photo update explicitly
        photo = validated_data.pop('photo', None)
        
        # Update other fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        # Update photo if provided
        if photo:
            instance.photo = photo
        
        instance.save()
        return instance
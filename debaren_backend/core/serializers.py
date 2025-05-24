from rest_framework import serializers
from .models import Venue, PopupVenue, WifiSpot, SchoolProgram, About, FooterSocialLink

class VenueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Venue
        fields = '__all__'

class PopupVenueSerializer(serializers.ModelSerializer):
    class Meta:
        model = PopupVenue
        fields = '__all__'

class WifiSpotSerializer(serializers.ModelSerializer):
    class Meta:
        model = WifiSpot
        fields = '__all__'

class SchoolProgramSerializer(serializers.ModelSerializer):
    class Meta:
        model = SchoolProgram
        fields = '__all__'
        
        
class AboutSerializer(serializers.ModelSerializer):
    class Meta:
        model = About
        fields = ['title', 'description', 'image', 'updated_at']

class FooterSocialLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = FooterSocialLink
        fields = ['platform', 'url', 'icon', 'order']

from rest_framework import viewsets, mixins
from rest_framework.parsers import MultiPartParser, FormParser

from places.serializers import VenueSerializer
from places.models import SchoolProgram, Venue, WifiSpot
from .models import (
    PopupVenue, About,
    FooterSocialLink, HeroSection, ContactMessage
)
from .serializers import (
    PopupVenueSerializer, WifiSpotSerializer,
    SchoolProgramSerializer, AboutSerializer, FooterSocialLinkSerializer,
    HeroSectionSerializer, ContactMessageSerializer
)

class VenueViewSet(viewsets.ModelViewSet):
    queryset = Venue.objects.all()
    serializer_class = VenueSerializer
    parser_classes = [MultiPartParser, FormParser]

class PopupVenueViewSet(viewsets.ModelViewSet):
    queryset = PopupVenue.objects.all()
    serializer_class = PopupVenueSerializer
    parser_classes = [MultiPartParser, FormParser]

class WifiSpotViewSet(viewsets.ModelViewSet):
    queryset = WifiSpot.objects.all()
    serializer_class = WifiSpotSerializer

class SchoolProgramViewSet(viewsets.ModelViewSet):
    queryset = SchoolProgram.objects.all()
    serializer_class = SchoolProgramSerializer
    parser_classes = [MultiPartParser, FormParser]

class AboutViewSet(viewsets.ModelViewSet):
    queryset = About.objects.all()
    serializer_class = AboutSerializer
    parser_classes = [MultiPartParser, FormParser]

class FooterSocialLinkViewSet(viewsets.ModelViewSet):
    queryset = FooterSocialLink.objects.all()
    serializer_class = FooterSocialLinkSerializer

class HeroSectionViewSet(viewsets.ModelViewSet):
    queryset = HeroSection.objects.all()
    serializer_class = HeroSectionSerializer

class ContactMessageViewSet(viewsets.ModelViewSet):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer

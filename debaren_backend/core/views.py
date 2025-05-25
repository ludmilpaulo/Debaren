from rest_framework import viewsets, generics
from rest_framework.response import Response
from rest_framework import status

from rest_framework.generics import RetrieveAPIView
from .models import Venue, PopupVenue, WifiSpot, SchoolProgram,About, FooterSocialLink, HeroSection
from .serializers import VenueSerializer, PopupVenueSerializer, WifiSpotSerializer, SchoolProgramSerializer, AboutSerializer, FooterSocialLinkSerializer, HeroSectionSerializer

class VenueViewSet(viewsets.ModelViewSet):
    queryset = Venue.objects.all()
    serializer_class = VenueSerializer

class PopupVenueViewSet(viewsets.ModelViewSet):
    queryset = PopupVenue.objects.all()
    serializer_class = PopupVenueSerializer

class WifiSpotViewSet(viewsets.ModelViewSet):
    queryset = WifiSpot.objects.all()
    serializer_class = WifiSpotSerializer

class SchoolProgramViewSet(viewsets.ModelViewSet):
    queryset = SchoolProgram.objects.all()
    serializer_class = SchoolProgramSerializer

class AboutDetailView(generics.RetrieveAPIView):
    queryset = About.objects.all()
    serializer_class = AboutSerializer

    def get_object(self):
        # Always return the latest About entry (or customize as needed)
        return About.objects.latest('updated_at')

class FooterSocialLinkListView(generics.ListAPIView):
    queryset = FooterSocialLink.objects.all()
    serializer_class = FooterSocialLinkSerializer
    
    
class HeroSectionView(RetrieveAPIView):
    queryset = HeroSection.objects.all()
    serializer_class = HeroSectionSerializer

    def get_object(self):
        qs = HeroSection.objects.all()
        if qs.exists():
            return qs.latest('updated_at')
        # Optional: Return None here, or raise a custom error.
        return None

    def get(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            if instance is None:
                # Custom default
                return Response({
                    "title": "Discover Beautiful Venues Across South Africa",
                    "subtitle": "From schools to popup spaces and connected WiFi zones — debaren helps you find the perfect place.",
                    "cta_text": "Explore Venues",
                    "cta_url": "/venues"
                }, status=status.HTTP_200_OK)
            serializer = self.get_serializer(instance)
            return Response(serializer.data)
        except HeroSection.DoesNotExist:
            return Response({
                "title": "Discover Beautiful Venues Across South Africa",
                "subtitle": "From schools to popup spaces and connected WiFi zones — debaren helps you find the perfect place.",
                "cta_text": "Explore Venues",
                "cta_url": "/venues"
            }, status=status.HTTP_200_OK)

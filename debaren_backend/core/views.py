from rest_framework import viewsets, generics
from .models import Venue, PopupVenue, WifiSpot, SchoolProgram,About, FooterSocialLink
from .serializers import VenueSerializer, PopupVenueSerializer, WifiSpotSerializer, SchoolProgramSerializer, AboutSerializer, FooterSocialLinkSerializer

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
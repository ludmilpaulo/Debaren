from django.urls import path, include

from .content_views import ContactMessageViewSet
from .contact_views import ContactFormView
from rest_framework.routers import DefaultRouter
from .views import AboutDetailView, FooterSocialLinkListView, VenueViewSet, PopupVenueViewSet, WifiSpotViewSet, SchoolProgramViewSet, HeroSectionView

router = DefaultRouter()
router.register(r'venues', VenueViewSet)
router.register(r'popup-venues', PopupVenueViewSet)
router.register(r'wifi-spots', WifiSpotViewSet)
router.register(r'school-programs', SchoolProgramViewSet)
router.register(r'contact-messages', ContactMessageViewSet, basename="contactmessage")



urlpatterns = [
    path('', include(router.urls)),
    path('about/', AboutDetailView.as_view(), name='about'),
    path('hero/', HeroSectionView.as_view(), name="hero-section"),
    path('footer-social-links/', FooterSocialLinkListView.as_view(), name='footer-social-links'),
    path('contact/', ContactFormView.as_view(), name='contact-form'),
    
]

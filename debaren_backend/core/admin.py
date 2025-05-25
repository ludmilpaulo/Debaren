from django.contrib import admin
from .models import Venue, PopupVenue, WifiSpot, SchoolProgram,About, FooterSocialLink, HeroSection

admin.site.register(Venue)
admin.site.register(PopupVenue)
admin.site.register(WifiSpot)
admin.site.register(SchoolProgram)
admin.site.register(HeroSection)

admin.site.register(About)
admin.site.register(FooterSocialLink)

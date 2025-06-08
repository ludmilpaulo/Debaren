from django.contrib import admin
from .models import Venue, VenueGalleryImage, WifiSpot, SchoolProgram

class VenueGalleryImageInline(admin.TabularInline):
    model = VenueGalleryImage
    extra = 1

@admin.register(Venue)
class VenueAdmin(admin.ModelAdmin):
    list_display = ("name", "venue_type", "city", "capacity", "available", "created_at")
    search_fields = ("name", "city", "region", "country")
    list_filter = ("venue_type", "available", "city", "country")
    inlines = [VenueGalleryImageInline]

@admin.register(WifiSpot)
class WifiSpotAdmin(admin.ModelAdmin):
    list_display = ("name", "city", "available", "provider")
    search_fields = ("name", "city", "region", "country", "provider")
    list_filter = ("available", "city", "country")

@admin.register(SchoolProgram)
class SchoolProgramAdmin(admin.ModelAdmin):
    list_display = ("name", "city", "country", "start_date", "end_date")
    search_fields = ("name", "city", "region", "country")
    list_filter = ("city", "country", "start_date")

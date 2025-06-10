from django.contrib import admin
from django.utils.html import format_html
from .models import Venue, VenueGalleryImage, WifiSpot, SchoolProgram, Booking


class VenueGalleryImageInline(admin.TabularInline):
    model = VenueGalleryImage
    extra = 1
    fields = ('image', 'caption', 'order', 'image_preview',)
    readonly_fields = ('image_preview',)
    ordering = ('order',)

    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="width: 80px; border-radius: 8px;" />', obj.image.url)
        return "-"
    image_preview.short_description = "Preview"


@admin.register(Venue)
class VenueAdmin(admin.ModelAdmin):
    list_display = (
        "name", "venue_type", "city", "region", "country",
        "capacity", "available", "created_at", "updated_at", "image_preview"
    )
    search_fields = ("name", "city", "region", "country", "address", "tags")
    list_filter = ("venue_type", "city", "country", "available")
    readonly_fields = ("created_at", "updated_at", "image_preview")
    inlines = [VenueGalleryImageInline]
    fieldsets = (
        (None, {
            "fields": (
                ("name", "venue_type", "available"),
                "description",
                ("image", "image_preview"),
                ("address", "city", "region", "country", "postal_code"),
                ("latitude", "longitude"),
                "capacity",
                "amenities",
                "price_per_day",
                ("contact_email", "contact_phone", "website"),
                "tags",
                "rating",
            )
        }),
        ("Timestamps", {
            "fields": ("created_at", "updated_at"),
            "classes": ("collapse",),
        }),
    )

    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="width: 80px; border-radius: 8px;" />', obj.image.url)
        return "-"
    image_preview.short_description = "Image"



@admin.register(WifiSpot)
class WifiSpotAdmin(admin.ModelAdmin):
    list_display = ("name", "city", "region", "country", "provider", "available", "created_at")
    search_fields = ("name", "city", "region", "country", "provider", "address")
    list_filter = ("available", "city", "region", "country")
    readonly_fields = ("created_at",)
    fieldsets = (
        (None, {
            "fields": (
                "name", "address", ("city", "region", "country"),
                ("latitude", "longitude"),
                "provider", "description",
                ("website", "contact_email", "contact_phone"),
                "available"
            )
        }),
        ("Created At", {
            "fields": ("created_at",),
            "classes": ("collapse",),
        }),
    )


@admin.register(SchoolProgram)
class SchoolProgramAdmin(admin.ModelAdmin):
    list_display = ("name", "city", "region", "country", "start_date", "end_date", "image_preview", "created_at")
    search_fields = ("name", "city", "region", "country", "address")
    list_filter = ("city", "region", "country", "start_date")
    readonly_fields = ("created_at", "image_preview")
    fieldsets = (
        (None, {
            "fields": (
                "name", "description", ("image", "image_preview"),
                "address", ("city", "region", "country"),
                ("contact_email", "contact_phone", "website"),
                ("start_date", "end_date")
            )
        }),
        ("Created At", {
            "fields": ("created_at",),
            "classes": ("collapse",),
        }),
    )

    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="width: 80px; border-radius: 8px;" />', obj.image.url)
        return "-"
    image_preview.short_description = "Image"


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = (
        "venue", "customer_name", "customer_email",
        "start_date", "end_date", "status", "created_at", "user"
    )
    search_fields = ("venue__name", "customer_name", "customer_email")
    list_filter = ("status", "venue__venue_type", "start_date", "end_date", "created_at")
    readonly_fields = ("created_at", "updated_at")
    fieldsets = (
        (None, {
            "fields": (
                "venue", "user",
                ("customer_name", "customer_email", "customer_phone"),
                ("start_date", "end_date"),
                "status", "notes"
            )
        }),
        ("Timestamps", {
            "fields": ("created_at", "updated_at"),
            "classes": ("collapse",),
        }),
    )
    ordering = ("-created_at",)


from django.contrib import admin
from .models import (
    PopupVenue, About, FooterSocialLink,
    HeroSection, ContactMessage
)

admin.site.site_header = "African Rise Admin"
admin.site.site_title = "African Rise Admin Portal"
admin.site.index_title = "Welcome to the African Rise Admin Dashboard"


@admin.register(PopupVenue)
class PopupVenueAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "location", "image_tag")
    search_fields = ("name", "location")
    readonly_fields = ("image_tag",)
    ordering = ("name",)

    def image_tag(self, obj):
        if obj.image:
            return f'<img src="{obj.image.url}" width="70" style="border-radius: 8px;" />'
        return "-"
    image_tag.short_description = "Image"
    image_tag.allow_tags = True

@admin.register(About)
class AboutAdmin(admin.ModelAdmin):
    list_display = ("title", "phone", "address", "short_description", "updated_at", "image_tag")
    search_fields = ("title", "phone", "address", "description")
    readonly_fields = ("updated_at", "image_tag")
    fieldsets = (
        (None, {
            "fields": ("title", "phone", "address", "description", "image", "image_tag")
        }),
        ("Metadata", {
            "fields": ("updated_at",),
            "classes": ("collapse",),
        }),
    )

    def short_description(self, obj):
        return (obj.description[:75] + "...") if len(obj.description) > 75 else obj.description
    short_description.short_description = "Description"

    def image_tag(self, obj):
        if obj.image:
            return f'<img src="{obj.image.url}" width="70" style="border-radius: 8px;" />'
        return "-"
    image_tag.short_description = "Image"
    image_tag.allow_tags = True

@admin.register(FooterSocialLink)
class FooterSocialLinkAdmin(admin.ModelAdmin):
    list_display = ("order", "platform", "url", "icon")
    search_fields = ("platform", "url", "icon")
    list_editable = ("order",)
    list_filter = ("platform",)
    ordering = ("order",)

@admin.register(HeroSection)
class HeroSectionAdmin(admin.ModelAdmin):
    list_display = ("title", "cta_text", "cta_url", "updated_at")
    search_fields = ("title", "subtitle", "cta_text")
    readonly_fields = ("updated_at",)
    fieldsets = (
        (None, {
            "fields": ("title", "subtitle", "cta_text", "cta_url")
        }),
        ("Metadata", {
            "fields": ("updated_at",),
            "classes": ("collapse",),
        }),
    )

@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "short_message", "created_at")
    search_fields = ("name", "email", "message")
    readonly_fields = ("created_at",)
    ordering = ("-created_at",)
    list_filter = ("created_at",)

    def short_message(self, obj):
        return (obj.message[:60] + "...") if len(obj.message) > 60 else obj.message
    short_message.short_description = "Message"

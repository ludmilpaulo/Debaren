from rest_framework import serializers
from .models import Booking
import json
import re
from rest_framework import serializers
from .models import Venue, VenueGalleryImage

class AmenityField(serializers.JSONField):
    def to_internal_value(self, data):
        # Try standard JSON parse
        try:
            return super().to_internal_value(data)
        except Exception:
            # Try to coerce: handle 'a, b, c' or 'a; b; c' etc
            if isinstance(data, str):
                # Remove quotes if present
                s = data.replace('"', '').replace("'", "")
                # Split by comma or semicolon
                items = re.split(r'[;,]', s)
                return [x.strip() for x in items if x.strip()]
            # If it's something else, fallback to string
            return [str(data)]


class VenueGalleryImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = VenueGalleryImage
        fields = ['id', 'image', 'caption', 'order']

class VenueSerializer(serializers.ModelSerializer):
    gallery = VenueGalleryImageSerializer(many=True, read_only=True)
    gallery_upload = serializers.ListField(
        child=serializers.ImageField(max_length=1000000, allow_empty_file=False, use_url=False),
        write_only=True, required=False,
    )
    amenities = AmenityField()  # <-- custom field here!

    class Meta:
        model = Venue
        fields = [
            "id", "name", "venue_type", "description", "image", "gallery", "gallery_upload",
            "address", "city", "region", "country", "postal_code", "latitude", "longitude",
            "capacity", "amenities", "price_per_day", "contact_email", "contact_phone",
            "website", "available", "rating", "tags", "created_at", "updated_at"
        ]
        read_only_fields = ("id", "created_at", "updated_at", "gallery")

    def to_internal_value(self, data):
        # Accept *anything* and try to coerce to a list of strings
        ret = super().to_internal_value(data)
        amenities = data.get('amenities')

        if amenities:
            if isinstance(amenities, list):
                ret['amenities'] = amenities
            elif isinstance(amenities, str):
                # Try JSON load (should work for ["a", "b", "c"])
                import json
                try:
                    loaded = json.loads(amenities)
                    if isinstance(loaded, list):
                        ret['amenities'] = [str(x).strip() for x in loaded]
                    else:
                        # If it's a single string/number, wrap as list
                        ret['amenities'] = [str(loaded).strip()]
                except Exception:
                    # Remove quotes, split by comma/semicolon/line/space, filter out blanks
                    import re
                    # Remove all quotes
                    amenities_clean = amenities.replace('"', '').replace("'", "")
                    # Split by comma, semicolon, or just whitespace if comma not present
                    if ',' in amenities_clean or ';' in amenities_clean:
                        chunks = re.split(r'[;,]', amenities_clean)
                    else:
                        chunks = amenities_clean.split()
                    ret['amenities'] = [x.strip() for x in chunks if x.strip()]
            else:
                ret['amenities'] = [str(amenities)]
        else:
            ret['amenities'] = []

        return ret

    def create(self, validated_data):
        gallery_files = validated_data.pop("gallery_upload", [])
        venue = super().create(validated_data)
        for img in gallery_files:
            VenueGalleryImage.objects.create(venue=venue, image=img)
        return venue

    def update(self, instance, validated_data):
        gallery_files = validated_data.pop("gallery_upload", [])
        venue = super().update(instance, validated_data)
        for img in gallery_files:
            VenueGalleryImage.objects.create(venue=venue, image=img)
        return venue

class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = [
            "id", "venue", "customer_name", "customer_email", "customer_phone",
            "start_date", "end_date", "notes", "created_at", "status"
        ]
        read_only_fields = ("id", "created_at", "status")

    def validate(self, data):
        if data["end_date"] and data["start_date"] and data["end_date"] < data["start_date"]:
            raise serializers.ValidationError("End date must be after start date.")
        return data

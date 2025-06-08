from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Venue, VenueGalleryImage
from .serializers import VenueSerializer

class VenueViewSet(viewsets.ModelViewSet):
    queryset = Venue.objects.all()
    serializer_class = VenueSerializer

    def create(self, request, *args, **kwargs):
        print("\n[VenueViewSet] Incoming POST data:", request.data)
        print("[VenueViewSet] Incoming FILES:", request.FILES)
        serializer = self.get_serializer(data=request.data)  # <-- FIXED HERE
        if not serializer.is_valid():
            print("[VenueViewSet] SERIALIZER ERRORS:", serializer.errors)
            return Response(serializer.errors, status=400)
        print("[VenueViewSet] SERIALIZER VALIDATED DATA:", serializer.validated_data)
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        print("\n[VenueViewSet] Incoming UPDATE data:", request.data)
        print("[VenueViewSet] Incoming FILES:", request.FILES)
        serializer = self.get_serializer(instance=self.get_object(), data=request.data, partial=True)  # <-- also NO files= here
        if not serializer.is_valid():
            print("[VenueViewSet] UPDATE SERIALIZER ERRORS:", serializer.errors)
            return Response(serializer.errors, status=400)
        print("[VenueViewSet] UPDATE SERIALIZER VALIDATED DATA:", serializer.validated_data)
        return super().update(request, *args, **kwargs)

    @action(detail=True, methods=["delete"], url_path="remove-gallery-image/(?P<image_id>[^/.]+)")
    def remove_gallery_image(self, request, pk=None, image_id=None):
        venue = self.get_object()
        try:
            img = venue.gallery.get(id=image_id)
            img.delete()
            print(f"[VenueViewSet] Removed image {image_id} from venue {venue.id}")
            return Response({"detail": "Image removed"}, status=200)
        except VenueGalleryImage.DoesNotExist:
            print(f"[VenueViewSet] Image {image_id} not found for venue {venue.id}")
            return Response({"detail": "Not found"}, status=404)

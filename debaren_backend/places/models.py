from django.db import models



from django.contrib.auth.models import User


class Venue(models.Model):
    VENUE_TYPE_CHOICES = [
        ('country', 'Country'),
        ('city', 'City'),
        ('town', 'Town'),
        ('hall', 'Hall'),
        ('conference', 'Conference Center'),
        ('restaurant', 'Restaurant'),
        ('outdoor', 'Outdoor'),
        ('auditorium', 'Auditorium'),
        ('other', 'Other'),
    ]
    name = models.CharField(max_length=200)
    venue_type = models.CharField(max_length=30, choices=VENUE_TYPE_CHOICES)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='venues/', blank=True)
    address = models.CharField(max_length=250)
    city = models.CharField(max_length=120, blank=True)
    region = models.CharField(max_length=120, blank=True)  # Province, state, etc
    country = models.CharField(max_length=80, default="South Africa")
    postal_code = models.CharField(max_length=20, blank=True)
    latitude = models.DecimalField(max_digits=119, decimal_places=96, blank=True, null=True)
    longitude = models.DecimalField(max_digits=119, decimal_places=96, blank=True, null=True)
    capacity = models.PositiveIntegerField(default=0, help_text="Maximum number of guests")
    amenities = models.JSONField(default=list, blank=True, help_text="List of amenities (use choices)")
    price_per_day = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    contact_email = models.EmailField(blank=True, null=True)
    contact_phone = models.CharField(max_length=50, blank=True, null=True)
    website = models.URLField(blank=True, null=True)
    available = models.BooleanField(default=True)
    rating = models.FloatField(default=0, help_text="Average rating")
    tags = models.CharField(max_length=200, blank=True, help_text="Comma-separated tags (e.g. wedding, conference)")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Venue"
        verbose_name_plural = "Venues"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} ({self.venue_type})"

# models.py
class VenueGalleryImage(models.Model):
    venue = models.ForeignKey(Venue, related_name='gallery', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='venues/gallery/')
    caption = models.CharField(max_length=200, blank=True)
    order = models.PositiveIntegerField(default=0)  # NEW

    class Meta:
        ordering = ['order', 'id']


class WifiSpot(models.Model):
    name = models.CharField(max_length=200)
    address = models.TextField()
    city = models.CharField(max_length=120, blank=True)
    region = models.CharField(max_length=120, blank=True)
    country = models.CharField(max_length=80, default="South Africa")
    latitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    provider = models.CharField(max_length=120, blank=True)
    description = models.TextField(blank=True)
    website = models.URLField(blank=True)
    contact_email = models.EmailField(blank=True, null=True)
    contact_phone = models.CharField(max_length=50, blank=True, null=True)
    available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class SchoolProgram(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='school/', blank=True)
    address = models.CharField(max_length=250, blank=True)
    city = models.CharField(max_length=120, blank=True)
    region = models.CharField(max_length=120, blank=True)
    country = models.CharField(max_length=80, default="South Africa")
    contact_email = models.EmailField(blank=True, null=True)
    contact_phone = models.CharField(max_length=50, blank=True, null=True)
    website = models.URLField(blank=True)
    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Booking(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed'),
        ('rejected', 'Rejected'),
    ]

    venue = models.ForeignKey(Venue, related_name="bookings", on_delete=models.CASCADE)
  
    

    # Optionally: If you want to track registered users, otherwise leave as guest bookings
    user = models.ForeignKey(
       User, blank=True, null=True,
        on_delete=models.SET_NULL, related_name='bookings'
    )

    # Basic customer info for guests
    customer_name = models.CharField(max_length=120)
    customer_email = models.EmailField()
    customer_phone = models.CharField(max_length=30, blank=True)

    # Booking details
    start_date = models.DateField()
    end_date = models.DateField(blank=True, null=True)
    notes = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Booking"
        verbose_name_plural = "Bookings"
        ordering = ['-created_at']

    def __str__(self):
        return f"Booking for {self.content_object} ({self.customer_name}) - {self.status}"

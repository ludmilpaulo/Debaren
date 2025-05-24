from django.db import models

class Venue(models.Model):
    VENUE_TYPE_CHOICES = [
        ('country', 'Country'),
        ('city', 'City'),
        ('town', 'Town'),
    ]
    name = models.CharField(max_length=200)
    venue_type = models.CharField(max_length=20, choices=VENUE_TYPE_CHOICES)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='venues/', blank=True)

    def __str__(self):
        return f"{self.name} ({self.venue_type})"

class PopupVenue(models.Model):
    name = models.CharField(max_length=200)
    location = models.CharField(max_length=200)
    image = models.ImageField(upload_to='popup_venues/', blank=True)

    def __str__(self):
        return self.name

class WifiSpot(models.Model):
    name = models.CharField(max_length=200)
    address = models.TextField()

    def __str__(self):
        return self.name

class SchoolProgram(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    image = models.ImageField(upload_to='school/', blank=True)

    def __str__(self):
        return self.name
    
    
    
from django.db import models

class About(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    image = models.ImageField(upload_to='about/', blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class FooterSocialLink(models.Model):
    PLATFORM_CHOICES = [
        ('linkedin', 'LinkedIn'),
        ('instagram', 'Instagram'),
        ('facebook', 'Facebook'),
        ('pinterest', 'Pinterest'),
        ('tiktok', 'TikTok'),
    ]
    platform = models.CharField(max_length=20, choices=PLATFORM_CHOICES)
    url = models.URLField()
    icon = models.CharField(max_length=50, blank=True)  # e.g. 'FaInstagram'
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.platform}"


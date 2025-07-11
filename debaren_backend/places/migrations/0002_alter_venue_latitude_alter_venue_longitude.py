# Generated by Django 5.2.2 on 2025-06-08 20:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('places', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='venue',
            name='latitude',
            field=models.DecimalField(blank=True, decimal_places=96, max_digits=119, null=True),
        ),
        migrations.AlterField(
            model_name='venue',
            name='longitude',
            field=models.DecimalField(blank=True, decimal_places=96, max_digits=119, null=True),
        ),
    ]

# Generated by Django 5.2.1 on 2025-06-02 14:13

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('listings', '0004_alter_listingimage_listing'),
    ]

    operations = [
        migrations.AlterField(
            model_name='listingimage',
            name='listing',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='listings.listing'),
        ),
    ]

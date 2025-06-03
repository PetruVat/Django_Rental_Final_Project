from django.contrib import admin
from .models import Listing, ListingImage


class ListingImageInline(admin.TabularInline):  # или admin.StackedInline
    model = ListingImage
    extra = 1


@admin.register(Listing)
class ListingAdmin(admin.ModelAdmin):
    list_display = ('title', 'city', 'price', 'is_active')
    inlines = [ListingImageInline]


admin.site.register(ListingImage)

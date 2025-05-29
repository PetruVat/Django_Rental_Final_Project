"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView, TokenObtainPairView

from accounts.views import RegisterView,MyTokenObtainPairView, UserDetailView, LogoutView
from listings.views import ListingViewSet
from bookings.views import BookingViewSet
from reviews.views import ReviewViewSet


router = DefaultRouter()
router.register(r'listings', ListingViewSet, basename='listings')
router.register(r'bookings', BookingViewSet, basename='bookings')
router.register(r'reviews', ReviewViewSet, basename='reviews')

urlpatterns = [
    path('admin/', admin.site.urls),
    # Аутентификация
    path('api/auth/register/', RegisterView.as_view(), name='auth_register'),
    path('api/auth/login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/auth/logout/', LogoutView.as_view(), name='auth_logout'),
    path('api/auth/me/', UserDetailView.as_view(), name='user_detail'),
    # Основные API
    path('api/', include(router.urls)),
]

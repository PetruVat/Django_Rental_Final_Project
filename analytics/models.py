from django.conf import settings
from django.db import models
from django.utils import timezone
from listings.models import Listing

class SearchHistory(models.Model):
    """
    Модель для хранения истории поисковых запросов пользователей.
    """
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='search_history'
    )
    keyword = models.CharField(
        max_length=255,
        help_text='Ключевые слова, введённые пользователем при поиске'
    )
    timestamp = models.DateTimeField(
        default=timezone.now,
        help_text='Время, когда запрос был выполнен'
    )

    class Meta:
        ordering = ['-timestamp']
        verbose_name = 'История поиска'
        verbose_name_plural = 'История поисков'

    def __str__(self):
        return f'{self.user} searched "{self.keyword}" at {self.timestamp}'

class ViewHistory(models.Model):
    """
    Модель для хранения истории просмотров объявлений пользователями.
    """
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='view_history'
    )
    listing = models.ForeignKey(
        Listing,
        on_delete=models.CASCADE,
        related_name='view_history'
    )
    timestamp = models.DateTimeField(
        default=timezone.now,
        help_text='Время просмотра объявления'
    )

    class Meta:
        ordering = ['-timestamp']
        verbose_name = 'История просмотров'
        verbose_name_plural = 'История просмотров'

    def __str__(self):
        uname = self.user.username if self.user else 'Anonymous'
        return f'{uname} viewed {self.listing} at {self.timestamp}'

from rest_framework import serializers
from accounts.models import User
from django.contrib.auth.password_validation import validate_password


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'role')


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password]
        )
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'password2', 'role')

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError(
                {'password': 'Password fields didn\'t match.'}
            )
        return data

    def create(self, validated_data):
        # Удаляем вспомогательное поле
        validated_data.pop('password2')
        # Берём роль из данных, по умолчанию 'tenant'
        role = validated_data.get('role', 'tenant')
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            role=role,
            password=validated_data['password']
        )
        return user
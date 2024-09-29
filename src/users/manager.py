import logging
import uuid

from fastapi import Request
from fastapi_users import BaseUserManager, UUIDIDMixin

from src.config.authentication import AuthenticationSettings
from src.users.models import User

logger = logging.getLogger(__name__)


class UserManager(UUIDIDMixin, BaseUserManager[User, uuid.UUID]):
    settings = AuthenticationSettings()
    reset_password_token_secret = settings.reset_password_token_secret
    verification_token_secret = settings.verification_token_secret

    async def on_after_register(self, user: User, request: Request | None = None) -> None:
        logger.info("User %s has registered.", user.id)

    async def on_after_forgot_password(self, user: User, token: str, request: Request | None = None) -> None:
        logger.info("User %s has forgot their password. Reset token: %s", user.id, token)

    async def on_after_request_verify(self, user: User, token: str, request: Request | None = None) -> None:
        logger.info("Verification requested for user %s. Verification token: %s", user.id, token)

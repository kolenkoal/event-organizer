import logging
import uuid

from fastapi import Request
from fastapi_users import BaseUserManager, UUIDIDMixin

from users.models import User

logger = logging.getLogger(__name__)


class UserManager(UUIDIDMixin, BaseUserManager[User, uuid.UUID]):
    reset_password_token_secret = "123"
    verification_token_secret = "123"
    # TODO поменять на AuthenticationSettings.reset_password_token_secret

    async def on_after_register(self, user: User, request: Request | None = None):
        logger.info("User %s has registered.", user.id)

    # TODO: убрать комменты
    # async def on_after_forgot_password(
    #     self, user: User, token: str, request: Request | None = None
    # ):
    #     logger.info("User %s has forgot their password. Reset token: %s", user.id, token)
    #
    # async def on_after_request_verify(
    #     self, user: User, token: str, request: Request | None = None
    # ):
    #     logger.info("Verification requested for user %s. Verification token: %s", user.id, token)

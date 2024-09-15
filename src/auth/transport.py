from fastapi_users.authentication import BearerTransport

bearer_transport = BearerTransport(tokenUrl="auth/jwt/token")  # TODO: update URL

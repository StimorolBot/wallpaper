from abc import ABC


class CrudAbs(ABC):
    async def create(self, *args,  **kwargs):
        pass

    async def read(self, *args,  **kwargs):
        pass

    async def update(self, *args,  **kwargs):
        pass

    async def delite(self, *args,  **kwargs):
        pass


class PasswordAuthABC(ABC):
    def verify_password(self, *args,  **kwargs):
        ...

    def get_hash_password(self, *args,  **kwargs):
        ...


class UserManagerABC(ABC):
    async def auth(self, *args,  **kwargs):
        ...

    async def get_current_user(self, *args,  **kwargs):
        ...

    def user_config(self, *args,  **kwargs):
        ...


class JWTTokenABC(ABC):
    def encode(self, *args, **kwargs):
        ...

    def decode(self, *args, **kwargs):
        ...

    def create(self, *args, **kwargs):
        ...

    def valid_type(self, *args, **kwargs):
        ...

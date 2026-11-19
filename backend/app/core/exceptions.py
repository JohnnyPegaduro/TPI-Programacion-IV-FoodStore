class DomainError(Exception):
    def __init__(self, detail: str, status_code: int = 400):
        self.detail = detail
        self.status_code = status_code
        super().__init__(detail)


class NotFound(DomainError):
    def __init__(self, detail: str = 'Recurso no encontrado'):
        super().__init__(detail, 404)


class Conflict(DomainError):
    def __init__(self, detail: str = 'Registro duplicado'):
        super().__init__(detail, 409)


class Forbidden(DomainError):
    def __init__(self, detail: str = 'No tenés permiso para este recurso'):
        super().__init__(detail, 403)


class BusinessRule(DomainError):
    def __init__(self, detail: str):
        super().__init__(detail, 400)

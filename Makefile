CODE = src
CODE_WITHOUT_TESTS = src
PYTHON = 3.12

.PHONY: init
init:
	poetry config virtualenvs.create true --local
	poetry config virtualenvs.in-project true --local
	poetry env use python$(PYTHON)
	poetry shell
	poetry install --no-interaction --no-ansi
.PHONY: test
test:
	poetry run pytest -n 3

.PHONY: mypy
mypy:
	poetry run mypy --cache-dir=.mypy_cache $(CODE_WITHOUT_TESTS) --install-types --non-interactive

.PHONY: plint
plint:
	poetry run isort $(CODE)
	poetry run ruff format $(CODE)
	poetry run ruff check --fix $(CODE)
	poetry run toml-sort pyproject.toml --all --in-place

	poetry run ruff check $(CODE)
	poetry run isort --check-only $(CODE)
	make mypy
	poetry run pytest --dead-fixtures --dup-fixtures
	poetry check
	poetry run toml-sort pyproject.toml --all --in-place --check

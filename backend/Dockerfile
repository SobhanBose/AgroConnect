FROM python:3.12-slim

# Install uv.
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/


# Copy the application into the container.
COPY . /app

# Set the working directory in the container to /app.
WORKDIR /app

# Install the application dependencies.
# RUN uv sync --frozen --no-cache
RUN uv venv && \
    . .venv/bin/activate && \
    uv pip install --upgrade pip && \
    uv sync --frozen --no-cache

# Run the application.
CMD ["/app/.venv/bin/fastapi", "run", "app", "--port", "8000", "--host", "0.0.0.0"]
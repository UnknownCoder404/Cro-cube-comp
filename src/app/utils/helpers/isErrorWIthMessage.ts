export function isErrorWithMessage(
    error: unknown,
): error is { message: string } {
    return (
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof (error as { message: unknown }).message === "string"
    );
}

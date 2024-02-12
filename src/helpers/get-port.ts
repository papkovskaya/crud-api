const DEFAULT_PORT: string = '4000';

export function getPort(): string {
    return process.env.__PORT ?? DEFAULT_PORT;
}
export function buildPageUrl(basePath: string, query: Record<string, any>, page: number): string {
    const params = new URLSearchParams({
        ...query,
        page: String(page)
    });

    return `${basePath}?${params.toString()}`;
}

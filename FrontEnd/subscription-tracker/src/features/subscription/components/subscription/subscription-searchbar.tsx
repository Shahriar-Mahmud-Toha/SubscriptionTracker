'use client';
//Not implemented
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { searchSubscription } from '@/features/subscription/actions';
import { SubscriptionType } from '@/features/subscription/types';
import { useDebounce } from '@/hooks/useDebounce';
import { Search, X } from 'lucide-react';

export default function SubscriptionSearchbar() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [results, setResults] = useState<SubscriptionType[]>([]);
    const [showResults, setShowResults] = useState(false);
    const debouncedSearch = useDebounce(search, 500);

    useEffect(() => {
        const performSearch = async () => {
            if (!debouncedSearch.trim()) {
                setResults([]);
                setShowResults(false);
                return;
            }

            setIsLoading(true);
            setError(null);
            try {
                const { data, error } = await searchSubscription(debouncedSearch);
                if (error) {
                    setError(error);
                    setResults([]);
                } else if (data) {
                    setResults(data);
                    setShowResults(true);
                }
            } catch (err) {
                setError('Failed to search subscriptions');
                setResults([]);
            } finally {
                setIsLoading(false);
            }
        };

        performSearch();
    }, [debouncedSearch]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (search.trim()) {
            router.push(`/subscription?search=${encodeURIComponent(search.trim())}`);
            setShowResults(false);
        }
    };

    const handleClear = () => {
        setSearch('');
        setResults([]);
        setShowResults(false);
        router.push('/subscription');
    };

    return (
        <div className="relative">
            <form onSubmit={handleSearch} className="relative">
                <div className="relative">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search subscriptions..."
                        className="w-full px-4 py-2 pl-10 pr-10 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    {search && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>
            </form>

            {/* Search Results Dropdown */}
            {showResults && (search.trim() || isLoading) && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-96 overflow-y-auto">
                    {isLoading ? (
                        <div className="p-4 text-center text-gray-500">Searching...</div>
                    ) : error ? (
                        <div className="p-4 text-center text-red-500">{error}</div>
                    ) : results.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">No results found</div>
                    ) : (
                        <div className="py-2">
                            {results.map((subscription) => (
                                <div
                                    key={subscription.id}
                                    onClick={() => {
                                        router.push(`/subscription/${subscription.id}`);
                                        setShowResults(false);
                                    }}
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                >
                                    <div className="font-medium">{subscription.name}</div>
                                    {subscription.seller_info && (
                                        <div className="text-sm text-gray-500">{subscription.seller_info}</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
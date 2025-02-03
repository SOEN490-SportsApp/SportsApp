import { useState, useEffect, useCallback } from "react";

// Define API response type
interface ApiResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
}

// Define generic pagination hook
const usePagination = <T,>(
  apiFunction: (page: number, pageSize: number) => Promise<{ data: ApiResponse<T> }>, dependency: any
) => {
  const [initialLoader, setInitialLoader] = useState<boolean>(true);
  const [data, setData] = useState<T[]>([]);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [pageNo, setPageNo] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);

  // Fetch paginated data using the helper API function
  const fetchData = async (page: number = 0, pageSize: number = 10) => {
    try {
      const response = await apiFunction(page, pageSize);
      const result = response.data;

      if (result.content && result.content.length > 0) {
        setData((prevData) => (page === 0 ? result.content : [...prevData, ...result.content]));
        setTotalElements(result.totalElements);
        setPageNo(result.pageable.pageNumber);
        setTotalPages(result.totalPages);
      } else {
        console.warn("No data received from API.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setRefreshing(false);
      setLoadingMore(false);
      setInitialLoader(false);
    }
  };

  useEffect(() => {
    fetchData(0);
  }, [dependency]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      fetchData(0);
    }, 1000);
  }, [dependency]);

  // Load more pages when scrolling
  const loadMore = () => {
    if (!loadingMore && pageNo + 1 < totalPages) {
    setTimeout(() => {
    fetchData(pageNo + 1);
    }, 1500);
    }
  };

  return {
    data,
    totalElements,
    pageNo,
    totalPages,
    refreshing,
    loadingMore,
    handleRefresh,
    loadMore,
    initialLoader,
  };
};

export default usePagination;

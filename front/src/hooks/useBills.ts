import { useEffect, useState } from "react";

type Bill = {
  id: number;
  userId: number;
  amount: number;
};

type UseBillsReturn = {
  bills: { total: number; data: Bill[] };
  currentPage: number;
  handleNextPage: () => void;
  handlePreviousPage: () => void;
  loading: boolean; // Include loading in the return type
};

const useBills = (): UseBillsReturn => {
  const [bills, setBills] = useState<{ total: number; data: Bill[] }>({
    total: 0,
    data: [],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false); // Added loading state
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Set loading to true before fetching
      try {
        const skip = (currentPage - 1) * itemsPerPage;
        const response = await fetch(
          `http://localhost:3000/bill?skip=${skip}&take=${itemsPerPage}`
        );
        const data = await response.json();
        setBills(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchData();
  }, [currentPage]);

  const handleNextPage = () => {
    if (currentPage * itemsPerPage < bills.total) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return { bills, currentPage, handleNextPage, handlePreviousPage, loading }; // Return loading
};

export default useBills;

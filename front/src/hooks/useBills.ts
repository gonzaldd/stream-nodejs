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
  loading: boolean;
  handleDownload: () => void;
  downloadFileLoading: boolean;
};

const useBills = (): UseBillsReturn => {
  const [bills, setBills] = useState<{ total: number; data: Bill[] }>({
    total: 0,
    data: [],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [downloadFileLoading, setDownloadFileLoading] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
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
        setLoading(false);
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

  const handleDownload = async () => {
    setDownloadFileLoading(true);

    try {
      const response = await fetch("http://localhost:3000/bill/stream-to-s3");
      const data = await response.json();

      if (data.downloadURL) {
        window.open(data.downloadURL, "_blank");
      }
    } catch (error) {
      console.error("Error downloading file:", error);
      alert("Error downloading file. Please try again.");
    } finally {
      setDownloadFileLoading(false);
    }
  };

  return {
    bills,
    currentPage,
    handleNextPage,
    handlePreviousPage,
    loading,
    handleDownload,
    downloadFileLoading,
  };
};

export default useBills;

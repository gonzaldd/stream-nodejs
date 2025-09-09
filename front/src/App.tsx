import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useBills from "@/hooks/useBills";

function App() {
  const { bills, currentPage, handleNextPage, handlePreviousPage, loading } = useBills();


  const handleDownload = () => { };

  return (
    <>
      {loading && bills.data.length === 0 ? (
        <div className="text-3xl">Loading...</div>
      ) : (
        <>
          <div className='text-right mb-8'>
            <Button disabled onClick={handleDownload}>Download all the data</Button>
          </div>
          <Table className="w-4xl">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Invoice</TableHead>
                <TableHead>User ID</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bills.data.map((bill) => (
                <TableRow key={bill.id}>
                  <TableCell className="font-medium">{bill.id}</TableCell>
                  <TableCell>{bill.userId}</TableCell>
                  <TableCell className="text-right">${bill.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex justify-between mt-8">
            <Button onClick={handlePreviousPage} disabled={currentPage === 1}>
              Previous
            </Button>
            <span>Page {currentPage}</span>
            <Button onClick={handleNextPage} disabled={currentPage * 10 >= bills.total}>
              Next
            </Button>
          </div>
        </>
      )}
    </>
  );
}

export default App

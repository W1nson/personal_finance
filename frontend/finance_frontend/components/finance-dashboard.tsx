"use client"

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import { ThemeToggle } from './theme-toggle'
import { useTheme } from 'next-themes'

// Define types for our data structures
type CategoryData = {
  name: string;
  value: number;
}

type MonthlyData = {
  name: string;
  income: number;
  expenses: number;
}

type TransactionData = {
  id: number;
  date: string;
  description: string;
  amount: number;
  category: string;
}

// Mock data
const categoryData: CategoryData[] = [
  { name: 'Housing', value: 1500 },
  { name: 'Food', value: 500 },
  { name: 'Transportation', value: 300 },
  { name: 'Entertainment', value: 200 },
  { name: 'Utilities', value: 400 },
]

const monthlyData: MonthlyData[] = [
  { name: 'Jan', income: 4000, expenses: 3000 },
  { name: 'Feb', income: 4200, expenses: 3100 },
  { name: 'Mar', income: 4100, expenses: 2900 },
  { name: 'Apr', income: 4400, expenses: 3400 },
]

const transactionData: TransactionData[] = [
  { id: 1, date: '2023-06-01', description: 'Grocery Shopping', amount: -120.50, category: 'Food' },
  { id: 2, date: '2023-06-02', description: 'Salary Deposit', amount: 3000, category: 'Income' },
  { id: 3, date: '2023-06-03', description: 'Electric Bill', amount: -85.20, category: 'Utilities' },
  { id: 4, date: '2023-06-04', description: 'Movie Night', amount: -30, category: 'Entertainment' },
  { id: 5, date: '2023-06-05', description: 'Gas Station', amount: -45.00, category: 'Transportation' },
  { id: 6, date: '2023-06-06', description: 'Online Shopping', amount: -78.99, category: 'Shopping' },
  { id: 7, date: '2023-06-07', description: 'Restaurant Dinner', amount: -65.30, category: 'Food' },
  { id: 8, date: '2023-06-08', description: 'Gym Membership', amount: -50.00, category: 'Health' },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export function FinanceDashboardComponent() {
  const [activeIndex, setActiveIndex] = useState<number>(0)
  const [sortColumn, setSortColumn] = useState<keyof TransactionData>('date')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState<string>('')
  const { theme } = useTheme()

  const onPieEnter = (_: unknown, index: number) => {
    setActiveIndex(index)
  }

  const handleSort = (column: keyof TransactionData) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  const filteredAndSortedTransactions = useMemo(() => {
    return transactionData
      .filter(transaction => 
        (filterCategory === 'all' || transaction.category === filterCategory) &&
        (transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
         transaction.category.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      .sort((a, b) => {
        if (a[sortColumn] < b[sortColumn]) return sortDirection === 'asc' ? -1 : 1
        if (a[sortColumn] > b[sortColumn]) return sortDirection === 'asc' ? 1 : -1
        return 0
      })
  }, [filterCategory, searchTerm, sortColumn, sortDirection])

  const uniqueCategories = Array.from(new Set(transactionData.map(t => t.category)))

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Personal Finance Dashboard</h1>
        <ThemeToggle />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Expense Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  data={categoryData}
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  onMouseEnter={onPieEnter}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Income vs Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="income" fill={theme === 'dark' ? '#8884d8' : '#8884d8'} />
                <Bar dataKey="expenses" fill={theme === 'dark' ? '#82ca9d' : '#82ca9d'} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Financial Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="text-lg font-semibold">Total Income</h3>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">$16,700</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Total Expenses</h3>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">$12,400</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Net Savings</h3>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">$4,300</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <Label htmlFor="search">Search</Label>
              <Input
                id="search"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="category">Filter by Category</Label>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {uniqueCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort('date')}>
                    Date {sortColumn === 'date' && (sortDirection === 'asc' ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />)}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort('description')}>
                    Description {sortColumn === 'description' && (sortDirection === 'asc' ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />)}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort('amount')}>
                    Amount {sortColumn === 'amount' && (sortDirection === 'asc' ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />)}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort('category')}>
                    Category {sortColumn === 'category' && (sortDirection === 'asc' ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />)}
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell className={transaction.amount > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                    ${Math.abs(transaction.amount).toFixed(2)}
                  </TableCell>
                  <TableCell>{transaction.category}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

// Update the type for renderActiveShape

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props
  const sin = Math.sin(-RADIAN * midAngle)
  const cos = Math.cos(-RADIAN * midAngle)
  const sx = cx + (outerRadius + 10) * cos
  const sy = cy + (outerRadius + 10) * sin
  const mx = cx + (outerRadius + 30) * cos
  const my = cy + (outerRadius + 30) * sin
  const ex = mx + (cos >= 0 ? 1 : -1) * 22
  const ey = my
  const textAnchor = cos >= 0 ? 'start' : 'end'

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`$${value}`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
        {`(${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  )
}
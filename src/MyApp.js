import { useState } from 'react'

function ProductCategoryRow({ category }) {
  return (
    <tr>
      <th colSpan="2">{category}</th>
    </tr>
  )
}

function ProductRow({ name, price, stocked }) {
  return (
    <tr>
      <td style={stocked ? {} : { color: 'red' }}>{name}</td>
      <td>{price}</td>
    </tr>
  )
}


function decomposeData(data) {
  return data.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});
}

function ProductTable({ data }) {
  const dataSortedByCategories = decomposeData(data)

  const rows = Object.keys(dataSortedByCategories).reduce((acc, category) => {
    // Add the category row
    acc.push(<ProductCategoryRow key={category} category={category} />);

    // Add each item in the category
    dataSortedByCategories[category].forEach(item => {
      acc.push(<ProductRow key={item.name} name={item.name} price={item.price} stocked={item.stocked} />);
    });

    return acc;
  }, []);

  return <table>
    <thead>
      <tr>
        <th className='label'>Name</th>
        <th className='label'>Price</th>
      </tr>
    </thead>
    <tbody>
      {rows}
    </tbody>
  </table>
}

function SearchBar({ onSearch, onCheck, filterText, inStockOnly }) {
  return (
    <form>
      <input onChange={(e) => onSearch(e.target.value)} type="search" placeholder="Search..." value={filterText}></input>
      <label>
        <input onChange={(e) => onCheck(e.target.checked)} type="checkbox" checked={inStockOnly}></input>{' '}Only show products in stock
      </label>
    </form>
  )
}

function FilterableProductTable({ data }) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const filtered_data = data.reduce((acc, product) => {
    if (inStockOnly && product.stocked == false) {
      return acc
    }
    if (!product.name.includes(filterText) && !product.category.includes(filterText)) {
      return acc
    }
    acc.push(product)
    return acc
  }, [])

  return (
    <div>
      <SearchBar filterText={filterText} inStockOnly={inStockOnly} onSearch={setFilterText} onCheck={setInStockOnly} />
      <ProductTable data={filtered_data} />
    </div>
  )
}

export default function App() {
  const data = [
    { category: "Fruits", price: "$1", stocked: true, name: "Apple" },
    { category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit" },
    { category: "Fruits", price: "$2", stocked: false, name: "Passionfruit" },
    { category: "Vegetables", price: "$2", stocked: true, name: "Spinach" },
    { category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin" },
    { category: "Vegetables", price: "$1", stocked: true, name: "Peas" }
  ]
  return <FilterableProductTable data={data} />;
}

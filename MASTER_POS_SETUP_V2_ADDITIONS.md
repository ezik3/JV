# ⚠️ CRITICAL - READ MASTER_POS_SETUP.md FIRST ⚠️

**AGENT INSTRUCTIONS:** This document contains ADDITIONAL requirements for the JointVibe POS V2 system. You MUST:
1. Read MASTER_POS_SETUP.md FIRST before reading this
2. These are NOT optional features - they are REQUIRED
3. Update completion status in BOTH documents
4. Follow specifications exactly as written

**Last Updated:** 2025-11-18
**Current Status:** Foundation Complete (Ready for Implementation)
**Completion:** 0% (V2 features not started yet - foundation ready)

---

# MASTER POS SETUP V2 - NEW ARCHITECTURE ADDITIONS

## Remaining Page Specifications (Pages 5-13)

### Page 5: Orders Management (`/venue/pos/orders`)

**Purpose:** View and manage all orders

**Layout:**
```tsx
<POSLayout>
  <div className="p-6">
    <div className="flex justify-between items-center mb-6">
      <h1>Orders</h1>
      <div className="flex gap-4">
        <DateRangePicker
          value={dateRange}
          onChange={setDateRange}
        />
        <Select value={statusFilter} onChange={setStatusFilter}>
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="preparing">Preparing</option>
          <option value="ready">Ready</option>
          <option value="served">Served</option>
          <option value="cancelled">Cancelled</option>
        </Select>
      </div>
    </div>

    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order #</TableHead>
          <TableHead>Date/Time</TableHead>
          <TableHead>Table</TableHead>
          <TableHead>Items</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map(order => (
          <TableRow key={order.id}>
            <TableCell className="font-bold">#{order.order_number}</TableCell>
            <TableCell>{formatDateTime(order.created_at)}</TableCell>
            <TableCell>{order.table_number}</TableCell>
            <TableCell>{order.items.length} items</TableCell>
            <TableCell>${order.total.toFixed(2)}</TableCell>
            <TableCell>
              <Badge variant={getStatusVariant(order.status)}>
                {order.status}
              </Badge>
            </TableCell>
            <TableCell>
              <Button size="sm" onClick={() => viewOrder(order)}>
                View
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
</POSLayout>
```

**Order Detail Modal:**
```tsx
<Dialog open={orderDetailOpen} onOpenChange={setOrderDetailOpen}>
  <DialogContent className="max-w-2xl">
    <DialogHeader>
      <DialogTitle>Order #{selectedOrder.order_number}</DialogTitle>
    </DialogHeader>

    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Table</Label>
          <p>{selectedOrder.table_number}</p>
        </div>
        <div>
          <Label>Time</Label>
          <p>{formatDateTime(selectedOrder.created_at)}</p>
        </div>
        <div>
          <Label>Server</Label>
          <p>{selectedOrder.staff.full_name}</p>
        </div>
        <div>
          <Label>Status</Label>
          <Badge>{selectedOrder.status}</Badge>
        </div>
      </div>

      <div>
        <Label>Items</Label>
        {selectedOrder.items.map(item => (
          <div key={item.id} className="flex justify-between py-2">
            <span>{item.quantity}x {item.name}</span>
            <span>${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>

      <Separator />

      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${selectedOrder.subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax</span>
          <span>${selectedOrder.tax.toFixed(2)}</span>
        </div>
        {selectedOrder.tip > 0 && (
          <div className="flex justify-between">
            <span>Tip</span>
            <span>${selectedOrder.tip.toFixed(2)}</span>
          </div>
        )}
        <Separator />
        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>${selectedOrder.total.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => printReceipt(selectedOrder)}>
          Print Receipt
        </Button>
        {selectedOrder.status !== 'cancelled' && (
          <Button variant="destructive" onClick={() => cancelOrder(selectedOrder)}>
            Cancel Order
          </Button>
        )}
      </div>
    </div>
  </DialogContent>
</Dialog>
```

---

### Page 6: Menu Management (`/venue/pos/menu`)

**Purpose:** CRUD operations for menu items and categories

**Layout:**
```tsx
<POSLayout>
  <div className="p-6">
    <div className="flex justify-between items-center mb-6">
      <h1>Menu Management</h1>
      <div className="flex gap-2">
        <Button onClick={() => setAddCategoryOpen(true)}>
          Add Category
        </Button>
        <Button onClick={() => setAddItemOpen(true)}>
          Add Menu Item
        </Button>
      </div>
    </div>

    <Tabs value={activeCategory} onValueChange={setActiveCategory}>
      <TabsList>
        {categories.map(cat => (
          <TabsTrigger key={cat.id} value={cat.id}>
            {cat.name}
          </TabsTrigger>
        ))}
      </TabsList>

      {categories.map(cat => (
        <TabsContent key={cat.id} value={cat.id}>
          <div className="grid grid-cols-4 gap-4">
            {menuItems
              .filter(item => item.category_id === cat.id)
              .map(item => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  onEdit={() => editMenuItem(item)}
                  onDelete={() => deleteMenuItem(item)}
                  onToggleAvailability={() => toggleAvailability(item)}
                />
              ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  </div>
</POSLayout>
```

**Add/Edit Menu Item Modal:**
```tsx
<Dialog open={addItemOpen} onOpenChange={setAddItemOpen}>
  <DialogContent className="max-w-3xl">
    <DialogHeader>
      <DialogTitle>
        {editingItem ? 'Edit Menu Item' : 'Add Menu Item'}
      </DialogTitle>
    </DialogHeader>

    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            {...register('name', { required: true })}
          />
        </div>

        <div>
          <Label htmlFor="category">Category</Label>
          <Select {...register('category_id', { required: true })}>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            {...register('price', { required: true })}
          />
        </div>

        <div>
          <Label htmlFor="cost">Cost (COGS)</Label>
          <Input
            id="cost"
            type="number"
            step="0.01"
            {...register('cost')}
          />
        </div>

        <div>
          <Label htmlFor="station">Station</Label>
          <Select {...register('station', { required: true })}>
            <option value="kitchen">Kitchen</option>
            <option value="bar">Bar</option>
            <option value="expo">Expo</option>
          </Select>
        </div>

        <div>
          <Label htmlFor="prep_time">Prep Time (minutes)</Label>
          <Input
            id="prep_time"
            type="number"
            {...register('preparation_time')}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...register('description')}
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="image">Image</Label>
        <Input
          id="image"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
        />
        {imagePreview && (
          <img src={imagePreview} alt="Preview" className="mt-2 h-32 object-cover" />
        )}
      </div>

      <div>
        <Label>Modifiers</Label>
        <ModifierBuilder
          modifiers={modifiers}
          onChange={setModifiers}
        />
      </div>

      <div>
        <Label>Allergens</Label>
        <div className="flex flex-wrap gap-2">
          {['Dairy', 'Eggs', 'Fish', 'Shellfish', 'Tree Nuts', 'Peanuts', 'Wheat', 'Soy'].map(allergen => (
            <label key={allergen} className="flex items-center gap-2">
              <Checkbox
                checked={allergens.includes(allergen)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setAllergens([...allergens, allergen]);
                  } else {
                    setAllergens(allergens.filter(a => a !== allergen));
                  }
                }}
              />
              {allergen}
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => setAddItemOpen(false)}>
          Cancel
        </Button>
        <Button type="submit">
          {editingItem ? 'Update' : 'Add'} Item
        </Button>
      </div>
    </form>
  </DialogContent>
</Dialog>
```

---

### Page 7: Tables Management (`/venue/pos/tables`)

**Purpose:** Manage table status and assignments

**Layout:**
```tsx
<POSLayout>
  <div className="p-6">
    <div className="flex justify-between items-center mb-6">
      <h1>Tables</h1>
      <div className="flex gap-2">
        <Button onClick={() => navigate('/venue/pos/floorplan')}>
          Edit Floorplan
        </Button>
        <Button onClick={() => setAddTableOpen(true)}>
          Add Table
        </Button>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-6">
      {/* LEFT: Table Grid */}
      <div>
        <h2 className="text-xl font-bold mb-4">All Tables</h2>
        <div className="grid grid-cols-4 gap-4">
          {tables.map(table => (
            <TableCard
              key={table.id}
              table={table}
              onClick={() => selectTable(table)}
              isActive={selectedTable?.id === table.id}
            />
          ))}
        </div>
      </div>

      {/* RIGHT: Selected Table Details */}
      <div>
        {selectedTable ? (
          <Card>
            <CardHeader>
              <CardTitle>Table {selectedTable.table_number}</CardTitle>
              <CardDescription>
                Section: {selectedTable.section || 'N/A'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Status</Label>
                <Select
                  value={selectedTable.status}
                  onChange={(e) => updateTableStatus(selectedTable.id, e.target.value)}
                >
                  <option value="available">Available</option>
                  <option value="occupied">Occupied</option>
                  <option value="reserved">Reserved</option>
                </Select>
              </div>

              <div>
                <Label>Capacity</Label>
                <Input
                  type="number"
                  value={selectedTable.capacity}
                  onChange={(e) => updateTableCapacity(selectedTable.id, e.target.value)}
                />
              </div>

              {selectedTable.status === 'occupied' && (
                <div>
                  <Label>Current Order</Label>
                  {currentOrder ? (
                    <div className="bg-slate-800 p-4 rounded">
                      <p className="font-bold">Order #{currentOrder.order_number}</p>
                      <p className="text-sm text-gray-400">
                        {currentOrder.items.length} items - ${currentOrder.total.toFixed(2)}
                      </p>
                      <Button
                        size="sm"
                        className="mt-2"
                        onClick={() => viewOrder(currentOrder)}
                      >
                        View Details
                      </Button>
                    </div>
                  ) : (
                    <p className="text-gray-400">No active order</p>
                  )}
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => printQRCode(selectedTable)}
                >
                  Print QR Code
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => deleteTable(selectedTable)}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="text-center text-gray-400 mt-20">
            Select a table to view details
          </div>
        )}
      </div>
    </div>
  </div>
</POSLayout>
```

**TableCard Component:**
```tsx
const TableCard = ({ table, onClick, isActive }) => {
  const statusColors = {
    available: 'bg-green-500/20 border-green-500',
    occupied: 'bg-red-500/20 border-red-500',
    reserved: 'bg-yellow-500/20 border-yellow-500'
  };

  return (
    <div
      className={`
        p-4 rounded-lg border-2 cursor-pointer
        ${statusColors[table.status]}
        ${isActive ? 'ring-2 ring-blue-500' : ''}
      `}
      onClick={onClick}
    >
      <div className="text-center">
        <p className="text-2xl font-bold">{table.table_number}</p>
        <p className="text-sm text-gray-400">
          {table.capacity} seats
        </p>
        <Badge variant={table.status} className="mt-2">
          {table.status}
        </Badge>
      </div>
    </div>
  );
};
```

---

### Page 8: Floorplan Editor (`/venue/pos/floorplan`)

**Purpose:** Visual floorplan designer with drag-and-drop

**Layout:**
```tsx
<POSLayout>
  <div className="p-6">
    <div className="flex justify-between items-center mb-6">
      <h1>Floorplan Editor</h1>
      <div className="flex gap-2">
        <Button variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          Save Floorplan
        </Button>
      </div>
    </div>

    <div className="grid grid-cols-12 gap-6">
      {/* LEFT: Tools Palette */}
      <div className="col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Tools</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => setActiveTool('table')}
            >
              🪑 Add Table
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => setActiveTool('wall')}
            >
              🧱 Draw Wall
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => setActiveTool('bar')}
            >
              🍹 Add Bar
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => setActiveTool('decoration')}
            >
              🎨 Add Decoration
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* CENTER: Canvas */}
      <div className="col-span-8">
        <div
          className="bg-slate-800 rounded-lg relative"
          style={{ width: '100%', height: '600px' }}
        >
          <canvas
            ref={canvasRef}
            width={canvasWidth}
            height={canvasHeight}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            className="cursor-crosshair"
          />
          {floorplanItems.map(item => (
            <DraggableItem
              key={item.id}
              item={item}
              onUpdate={updateItem}
              onDelete={deleteItem}
            />
          ))}
        </div>
      </div>

      {/* RIGHT: Properties */}
      <div className="col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Properties</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedItem ? (
              <div className="space-y-4">
                <div>
                  <Label>Type</Label>
                  <p className="text-sm">{selectedItem.type}</p>
                </div>

                {selectedItem.type === 'table' && (
                  <>
                    <div>
                      <Label>Table Number</Label>
                      <Input
                        value={selectedItem.tableNumber}
                        onChange={(e) => updateItemProp('tableNumber', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Capacity</Label>
                      <Input
                        type="number"
                        value={selectedItem.capacity}
                        onChange={(e) => updateItemProp('capacity', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Section</Label>
                      <Input
                        value={selectedItem.section}
                        onChange={(e) => updateItemProp('section', e.target.value)}
                      />
                    </div>
                  </>
                )}

                <div>
                  <Label>Rotation</Label>
                  <Slider
                    value={[selectedItem.rotation || 0]}
                    onValueChange={([val]) => updateItemProp('rotation', val)}
                    min={0}
                    max={360}
                  />
                </div>

                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => deleteItem(selectedItem.id)}
                >
                  Delete Item
                </Button>
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center mt-10">
                Select an item to edit
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</POSLayout>
```

**Save Floorplan:**
```ts
const handleSave = async () => {
  const { error } = await supabase
    .from('floorplans')
    .upsert({
      venue_id: venueId,
      name: 'Main Floor',
      canvas_width: canvasWidth,
      canvas_height: canvasHeight,
      items: floorplanItems
    });

  if (!error) {
    // Also update venue_tables with positions
    for (const item of floorplanItems.filter(i => i.type === 'table')) {
      await supabase
        .from('venue_tables')
        .update({
          x_position: item.x,
          y_position: item.y,
          floorplan_id: floorplan.id
        })
        .eq('id', item.tableId);
    }

    toast.success('Floorplan saved!');
  }
};
```

---

### Page 9: Inventory (`/venue/pos/inventory`)

**Purpose:** Stock tracking and management

**Layout:**
```tsx
<POSLayout>
  <div className="p-6">
    <div className="flex justify-between items-center mb-6">
      <h1>Inventory</h1>
      <Button onClick={() => setAddItemOpen(true)}>
        Add Inventory Item
      </Button>
    </div>

    <div className="mb-4 flex gap-4">
      <Input
        placeholder="Search inventory..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-sm"
      />
      <Select value={categoryFilter} onChange={setCategoryFilter}>
        <option value="all">All Categories</option>
        <option value="beverages">Beverages</option>
        <option value="food">Food</option>
        <option value="supplies">Supplies</option>
      </Select>
      <Select value={statusFilter} onChange={setStatusFilter}>
        <option value="all">All Status</option>
        <option value="good">Good</option>
        <option value="low">Low Stock</option>
        <option value="critical">Critical</option>
      </Select>
    </div>

    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>SKU</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Unit</TableHead>
          <TableHead>Threshold</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Last Restocked</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredInventory.map(item => (
          <TableRow key={item.id}>
            <TableCell className="font-mono">{item.sku}</TableCell>
            <TableCell>{item.name}</TableCell>
            <TableCell>{item.category}</TableCell>
            <TableCell className="font-bold">{item.quantity}</TableCell>
            <TableCell>{item.unit}</TableCell>
            <TableCell>{item.low_threshold}</TableCell>
            <TableCell>
              <Badge variant={getStockStatusVariant(item)}>
                {getStockStatus(item)}
              </Badge>
            </TableCell>
            <TableCell>
              {item.last_restocked ? formatDate(item.last_restocked) : 'Never'}
            </TableCell>
            <TableCell>
              <Button
                size="sm"
                variant="outline"
                onClick={() => openAdjustModal(item)}
              >
                Adjust
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
</POSLayout>
```

**Adjust Quantity Modal:**
```tsx
<Dialog open={adjustModalOpen} onOpenChange={setAdjustModalOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Adjust Inventory: {selectedItem?.name}</DialogTitle>
    </DialogHeader>

    <form onSubmit={handleAdjust} className="space-y-4">
      <div>
        <Label>Current Quantity</Label>
        <p className="text-2xl font-bold">{selectedItem?.quantity} {selectedItem?.unit}</p>
      </div>

      <div>
        <Label htmlFor="transaction_type">Transaction Type</Label>
        <Select
          id="transaction_type"
          value={transactionType}
          onChange={(e) => setTransactionType(e.target.value)}
        >
          <option value="restock">Restock</option>
          <option value="adjustment">Adjustment</option>
          <option value="consumption">Consumption</option>
          <option value="waste">Waste</option>
        </Select>
      </div>

      <div>
        <Label htmlFor="quantity">
          {transactionType === 'restock' ? 'Add' : 'Remove'} Quantity
        </Label>
        <Input
          id="quantity"
          type="number"
          step="0.01"
          value={adjustQuantity}
          onChange={(e) => setAdjustQuantity(e.target.value)}
        />
      </div>

      <div>
        <Label>New Quantity</Label>
        <p className="text-xl font-bold text-green-500">
          {calculateNewQuantity()} {selectedItem?.unit}
        </p>
      </div>

      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => setAdjustModalOpen(false)}>
          Cancel
        </Button>
        <Button type="submit">
          Confirm Adjustment
        </Button>
      </div>
    </form>
  </DialogContent>
</Dialog>
```

---

### Page 10: Sales Reports (`/venue/pos/sales`)

**Purpose:** Detailed sales breakdown

**Layout:**
```tsx
<POSLayout>
  <div className="p-6">
    <div className="flex justify-between items-center mb-6">
      <h1>Sales Reports</h1>
      <DateRangePicker value={dateRange} onChange={setDateRange} />
    </div>

    {/* Summary Cards */}
    <div className="grid grid-cols-4 gap-4 mb-8">
      <StatCard
        title="Total Revenue"
        value={`$${salesData.totalRevenue.toFixed(2)}`}
        trend="+15.3%"
        icon={DollarSign}
      />
      <StatCard
        title="Orders"
        value={salesData.totalOrders}
        trend="+8.7%"
        icon={ShoppingCart}
      />
      <StatCard
        title="Avg Order Value"
        value={`$${salesData.avgOrderValue.toFixed(2)}`}
        trend="+3.2%"
        icon={TrendingUp}
      />
      <StatCard
        title="Peak Hour"
        value={salesData.peakHour}
        icon={Clock}
      />
    </div>

    {/* Hourly Breakdown Chart */}
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Sales by Hour</CardTitle>
      </CardHeader>
      <CardContent>
        <BarChart
          data={hourlyData}
          width={800}
          height={300}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="hour" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="sales" fill="#6366f1" />
        </BarChart>
      </CardContent>
    </Card>

    {/* Top Selling Items */}
    <Card>
      <CardHeader>
        <CardTitle>Top Selling Items</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rank</TableHead>
              <TableHead>Item</TableHead>
              <TableHead>Quantity Sold</TableHead>
              <TableHead>Revenue</TableHead>
              <TableHead>Profit Margin</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topItems.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.quantity_sold}</TableCell>
                <TableCell>${item.revenue.toFixed(2)}</TableCell>
                <TableCell className="text-green-500">
                  {item.profit_margin.toFixed(1)}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
</POSLayout>
```

---

### Page 11: Analytics (`/venue/pos/analytics`)

**Purpose:** Comprehensive business intelligence

**Layout:**
```tsx
<POSLayout>
  <div className="p-6">
    <h1 className="mb-6">Analytics</h1>

    <Tabs defaultValue="overview">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="revenue">Revenue</TabsTrigger>
        <TabsTrigger value="customers">Customers</TabsTrigger>
        <TabsTrigger value="products">Products</TabsTrigger>
      </TabsList>

      {/* Tab 1: Overview */}
      <TabsContent value="overview">
        <div className="space-y-6">
          {/* Weekly Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Weekly Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <LineChart
                data={weeklyData}
                width={1000}
                height={300}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="sales" stroke="#6366f1" />
                <Line type="monotone" dataKey="orders" stroke="#10b981" />
              </LineChart>
            </CardContent>
          </Card>

          {/* Peak Hours Heatmap */}
          <Card>
            <CardHeader>
              <CardTitle>Peak Hours</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Heatmap showing busiest hours by day */}
              <HeatmapChart data={peakHoursData} />
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      {/* Tab 2: Revenue */}
      <TabsContent value="revenue">
        <div className="grid grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Revenue by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <PieChart width={400} height={300}>
                <Pie
                  data={categoryRevenue}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  fill="#6366f1"
                  label
                />
                <Tooltip />
              </PieChart>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
            </CardHeader>
            <CardContent>
              <PieChart width={400} height={300}>
                <Pie
                  data={paymentMethods}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  fill="#10b981"
                  label
                />
                <Tooltip />
              </PieChart>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      {/* Tab 3: Customers */}
      <TabsContent value="customers">
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <StatCard
              title="Total Customers"
              value={customerStats.total}
              icon={Users}
            />
            <StatCard
              title="New Customers"
              value={customerStats.new}
              icon={UserPlus}
            />
            <StatCard
              title="Returning Rate"
              value={`${customerStats.returningRate}%`}
              icon={Repeat}
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Customer Frequency</CardTitle>
            </CardHeader>
            <CardContent>
              <BarChart data={customerFrequency} width={800} height={300}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="visits" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="customers" fill="#6366f1" />
              </BarChart>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      {/* Tab 4: Products */}
      <TabsContent value="products">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Sales</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Profit</TableHead>
                    <TableHead>Margin</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productPerformance.map(product => (
                    <TableRow key={product.id}>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.quantity_sold}</TableCell>
                      <TableCell>${product.revenue.toFixed(2)}</TableCell>
                      <TableCell>${product.cost.toFixed(2)}</TableCell>
                      <TableCell className="text-green-500">
                        ${product.profit.toFixed(2)}
                      </TableCell>
                      <TableCell className="font-bold">
                        {product.margin.toFixed(1)}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  </div>
</POSLayout>
```

---

### Page 12: Staff Management (`/venue/pos/staff`)

**Purpose:** Employee management and invitations

**Layout:**
```tsx
<POSLayout>
  <div className="p-6">
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1>Staff Management</h1>
        <p className="text-gray-400">
          {activeStaff.length} staff members • {onShift.length} on shift
        </p>
      </div>
      <Button onClick={() => setInviteModalOpen(true)}>
        Invite Employee
      </Button>
    </div>

    {/* Active Staff */}
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Active Staff</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          {activeStaff.map(staff => (
            <StaffCard key={staff.id} staff={staff} />
          ))}
        </div>
      </CardContent>
    </Card>

    {/* Pending Invitations */}
    <Card>
      <CardHeader>
        <CardTitle>Pending Invitations</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Invited By</TableHead>
              <TableHead>Sent</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pendingInvitations.map(inv => (
              <TableRow key={inv.id}>
                <TableCell>{inv.employee_email}</TableCell>
                <TableCell>
                  <Badge>{inv.role}</Badge>
                </TableCell>
                <TableCell>{inv.invited_by_name}</TableCell>
                <TableCell>{formatDate(inv.created_at)}</TableCell>
                <TableCell>{formatDate(inv.expires_at)}</TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => resendInvitation(inv)}
                  >
                    Resend
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => cancelInvitation(inv)}
                  >
                    Cancel
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
</POSLayout>
```

**StaffCard Component:**
```tsx
const StaffCard = ({ staff }) => {
  const isOnShift = staff.shift?.status === 'active';

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src={staff.avatar_url} />
            <AvatarFallback>{staff.full_name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-bold">{staff.full_name}</p>
            <div className="flex items-center gap-2">
              <Badge variant={staff.role}>{staff.role}</Badge>
              {isOnShift && (
                <Badge variant="success">On Shift</Badge>
              )}
            </div>
          </div>
        </div>

        {isOnShift && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between text-sm">
              <span>Shift Duration</span>
              <span>{formatDuration(staff.shift.clock_in_time)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Today's Sales</span>
              <span>${staff.shift.total_sales.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Orders Served</span>
              <span>{staff.shift.orders_served}</span>
            </div>
          </div>
        )}

        <div className="mt-4 flex gap-2">
          <Button size="sm" variant="outline" onClick={() => viewStaffDetails(staff)}>
            Details
          </Button>
          <Button size="sm" variant="outline" onClick={() => editStaff(staff)}>
            Edit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
```

**Invite Employee Modal:**
```tsx
<Dialog open={inviteModalOpen} onOpenChange={setInviteModalOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Invite Employee</DialogTitle>
    </DialogHeader>

    <form onSubmit={handleInvite} className="space-y-4">
      <div>
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          placeholder="employee@example.com"
          value={inviteEmail}
          onChange={(e) => setInviteEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="role">Role</Label>
        <Select
          id="role"
          value={inviteRole}
          onChange={(e) => setInviteRole(e.target.value)}
          required
        >
          <option value="">Select role...</option>
          <option value="waiter">Waiter</option>
          <option value="bartender">Bartender</option>
          <option value="kitchen">Kitchen Staff</option>
          <option value="host">Host</option>
          <option value="manager">Manager</option>
        </Select>
      </div>

      <div>
        <Label>Permissions</Label>
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <Checkbox
              checked={permissions.canViewReports}
              onCheckedChange={(val) => setPermissions({...permissions, canViewReports: val})}
            />
            Can view reports
          </label>
          <label className="flex items-center gap-2">
            <Checkbox
              checked={permissions.canManageMenu}
              onCheckedChange={(val) => setPermissions({...permissions, canManageMenu: val})}
            />
            Can manage menu
          </label>
          <label className="flex items-center gap-2">
            <Checkbox
              checked={permissions.canRefundOrders}
              onCheckedChange={(val) => setPermissions({...permissions, canRefundOrders: val})}
            />
            Can process refunds
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => setInviteModalOpen(false)}>
          Cancel
        </Button>
        <Button type="submit">
          Send Invitation
        </Button>
      </div>
    </form>
  </DialogContent>
</Dialog>
```

**API Call:**
```ts
const handleInvite = async (e) => {
  e.preventDefault();

  const { data, error } = await supabase
    .from('employee_invitations')
    .insert({
      venue_id: venueId,
      employee_email: inviteEmail,
      invited_by: user.id,
      role: inviteRole,
      permissions: permissions,
      status: 'pending',
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    })
    .select()
    .single();

  if (!error) {
    // Send email via backend
    await fetch('/api/employee/send-invitation-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: inviteEmail,
        invitation_token: data.invitation_token,
        venue_name: venue.name,
        role: inviteRole
      })
    });

    toast.success('Invitation sent!');
    setInviteModalOpen(false);
  }
};
```

---

### Page 13: Settings (`/venue/pos/settings`)

**Purpose:** POS configuration and preferences

**Layout:**
```tsx
<POSLayout>
  <div className="p-6">
    <h1 className="mb-6">Settings</h1>

    <Tabs defaultValue="general">
      <TabsList>
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="payment">Payment</TabsTrigger>
        <TabsTrigger value="printer">Printers</TabsTrigger>
        <TabsTrigger value="hours">Hours</TabsTrigger>
        <TabsTrigger value="advanced">Advanced</TabsTrigger>
      </TabsList>

      {/* Tab 1: General */}
      <TabsContent value="general">
        <Card>
          <CardHeader>
            <CardTitle>Venue Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="venue_name">Venue Name</Label>
                <Input
                  id="venue_name"
                  value={settings.name}
                  onChange={(e) => updateSetting('name', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={settings.phone}
                  onChange={(e) => updateSetting('phone', e.target.value)}
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={settings.address}
                  onChange={(e) => updateSetting('address', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={settings.city}
                  onChange={(e) => updateSetting('city', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={settings.state}
                  onChange={(e) => updateSetting('state', e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="logo">Logo</Label>
              <Input
                id="logo"
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
              />
              {settings.logo_url && (
                <img src={settings.logo_url} alt="Logo" className="mt-2 h-20" />
              )}
            </div>

            <Button onClick={saveGeneralSettings}>
              Save General Settings
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Tab 2: Payment */}
      <TabsContent value="payment">
        <Card>
          <CardHeader>
            <CardTitle>Payment Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="tax_rate">Tax Rate (%)</Label>
              <Input
                id="tax_rate"
                type="number"
                step="0.01"
                value={settings.tax_rate}
                onChange={(e) => updateSetting('tax_rate', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="currency">Currency</Label>
              <Select
                id="currency"
                value={settings.currency}
                onChange={(e) => updateSetting('currency', e.target.value)}
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </Select>
            </div>

            <div>
              <Label>Accepted Payment Methods</Label>
              <div className="space-y-2">
                {['cash', 'card', 'mobile', 'jvcoin'].map(method => (
                  <label key={method} className="flex items-center gap-2">
                    <Checkbox
                      checked={settings.payment_methods.includes(method)}
                      onCheckedChange={(checked) => togglePaymentMethod(method, checked)}
                    />
                    {method.toUpperCase()}
                  </label>
                ))}
              </div>
            </div>

            <Button onClick={savePaymentSettings}>
              Save Payment Settings
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Tab 3: Printers */}
      <TabsContent value="printer">
        <Card>
          <CardHeader>
            <CardTitle>Printer Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="receipt_printer">Receipt Printer</Label>
              <Input
                id="receipt_printer"
                placeholder="IP address or USB path"
                value={settings.receipt_printer}
                onChange={(e) => updateSetting('receipt_printer', e.target.value)}
              />
              <Button
                size="sm"
                variant="outline"
                className="mt-2"
                onClick={testReceiptPrinter}
              >
                Test Print
              </Button>
            </div>

            <div>
              <Label htmlFor="kitchen_printer">Kitchen Printer</Label>
              <Input
                id="kitchen_printer"
                placeholder="IP address or USB path"
                value={settings.kitchen_printer}
                onChange={(e) => updateSetting('kitchen_printer', e.target.value)}
              />
              <Button
                size="sm"
                variant="outline"
                className="mt-2"
                onClick={testKitchenPrinter}
              >
                Test Print
              </Button>
            </div>

            <Button onClick={savePrinterSettings}>
              Save Printer Settings
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Tab 4: Hours */}
      <TabsContent value="hours">
        <Card>
          <CardHeader>
            <CardTitle>Operating Hours</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
              <div key={day} className="flex items-center gap-4">
                <label className="w-32 capitalize">{day}</label>
                <Checkbox
                  checked={settings.operating_hours[day]?.enabled}
                  onCheckedChange={(checked) => toggleDay(day, checked)}
                />
                {settings.operating_hours[day]?.enabled && (
                  <>
                    <Input
                      type="time"
                      value={settings.operating_hours[day].open}
                      onChange={(e) => updateHours(day, 'open', e.target.value)}
                      className="w-32"
                    />
                    <span>to</span>
                    <Input
                      type="time"
                      value={settings.operating_hours[day].close}
                      onChange={(e) => updateHours(day, 'close', e.target.value)}
                      className="w-32"
                    />
                  </>
                )}
              </div>
            ))}

            <Button onClick={saveOperatingHours}>
              Save Operating Hours
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Tab 5: Advanced */}
      <TabsContent value="advanced">
        <Card>
          <CardHeader>
            <CardTitle>Advanced Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="timezone">Timezone</Label>
              <Select
                id="timezone"
                value={settings.timezone}
                onChange={(e) => updateSetting('timezone', e.target.value)}
              >
                <option value="America/New_York">Eastern Time</option>
                <option value="America/Chicago">Central Time</option>
                <option value="America/Denver">Mountain Time</option>
                <option value="America/Los_Angeles">Pacific Time</option>
              </Select>
            </div>

            <div>
              <Label>Features</Label>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <Checkbox
                    checked={settings.features.enableAIWaiter}
                    onCheckedChange={(val) => toggleFeature('enableAIWaiter', val)}
                  />
                  Enable AI Waiter
                </label>
                <label className="flex items-center gap-2">
                  <Checkbox
                    checked={settings.features.enableCheckIn}
                    onCheckedChange={(val) => toggleFeature('enableCheckIn', val)}
                  />
                  Enable Customer Check-In
                </label>
                <label className="flex items-center gap-2">
                  <Checkbox
                    checked={settings.features.enableRemoteOrdering}
                    onCheckedChange={(val) => toggleFeature('enableRemoteOrdering', val)}
                  />
                  Enable Remote Ordering
                </label>
              </div>
            </div>

            <Button onClick={saveAdvancedSettings}>
              Save Advanced Settings
            </Button>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  </div>
</POSLayout>
```

---

## EMPLOYEE SYSTEM SPECIFICATIONS

### Employee Invitation Acceptance Page

**Route:** `/employee/invite/:token`

```tsx
export default function InvitationAccept() {
  const { token } = useParams();
  const [invitation, setInvitation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInvitation();
  }, [token]);

  const loadInvitation = async () => {
    const { data } = await supabase
      .from('employee_invitations')
      .select('*, venues(name, logo_url)')
      .eq('invitation_token', token)
      .single();

    if (data && data.status === 'pending' && new Date(data.expires_at) > new Date()) {
      setInvitation(data);
    }
    setLoading(false);
  };

  const handleAccept = async () => {
    // 1. Create employee_venue_link
    await supabase
      .from('employee_venue_links')
      .insert({
        user_id: user.id,
        venue_id: invitation.venue_id,
        role: invitation.role,
        permissions: invitation.permissions,
        is_active: true
      });

    // 2. Update invitation status
    await supabase
      .from('employee_invitations')
      .update({
        status: 'accepted',
        accepted_at: new Date()
      })
      .eq('id', invitation.id);

    // 3. Redirect to employee dashboard
    navigate('/employee/dashboard');
  };

  if (loading) return <div>Loading...</div>;

  if (!invitation) {
    return (
      <div className="text-center mt-20">
        <h1>Invalid or Expired Invitation</h1>
        <p>This invitation link is no longer valid.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
      <Card className="max-w-md">
        <CardHeader className="text-center">
          {invitation.venues.logo_url && (
            <img src={invitation.venues.logo_url} alt="Venue logo" className="h-20 mx-auto mb-4" />
          )}
          <CardTitle>You're Invited!</CardTitle>
          <CardDescription>
            Join {invitation.venues.name} as a {invitation.role}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Your Role</Label>
            <p className="text-lg font-bold capitalize">{invitation.role}</p>
          </div>

          <div>
            <Label>Permissions</Label>
            <ul className="list-disc list-inside text-sm text-gray-400">
              {Object.entries(invitation.permissions)
                .filter(([_, val]) => val)
                .map(([key]) => (
                  <li key={key}>{formatPermission(key)}</li>
                ))}
            </ul>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleAccept} className="flex-1">
              Accept Invitation
            </Button>
            <Button variant="outline" onClick={() => navigate('/')}>
              Decline
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

### Employee Shift Dashboard

**Route:** `/employee/dashboard`

```tsx
export default function EmployeeShiftDashboard() {
  const [assignedVenues, setAssignedVenues] = useState([]);
  const [activeShift, setActiveShift] = useState(null);

  const handleClockIn = async (venueId) => {
    const { data } = await supabase
      .from('employee_shifts')
      .insert({
        employee_id: user.id,
        venue_id: venueId,
        clock_in_time: new Date(),
        status: 'active'
      })
      .select()
      .single();

    setActiveShift(data);
  };

  const handleClockOut = async () => {
    await supabase
      .from('employee_shifts')
      .update({
        clock_out_time: new Date(),
        status: 'ended'
      })
      .eq('id', activeShift.id);

    setActiveShift(null);
  };

  if (activeShift) {
    return <EmployeeShiftMode shift={activeShift} onClockOut={handleClockOut} />;
  }

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <h1 className="text-2xl font-bold mb-6">Your Venues</h1>

      <div className="grid grid-cols-2 gap-6">
        {assignedVenues.map(venue => (
          <Card key={venue.id}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4 mb-4">
                <img src={venue.logo_url} alt={venue.name} className="h-16" />
                <div>
                  <h2 className="text-xl font-bold">{venue.name}</h2>
                  <Badge>{venue.role}</Badge>
                </div>
              </div>

              <Button onClick={() => handleClockIn(venue.id)} className="w-full">
                Clock In
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

---

## ENDUSER CHECK-IN SPECIFICATIONS

### Check-In Modal Component

```tsx
export function VenueCheckInModal({ venue, onCheckIn }) {
  const [tableNumber, setTableNumber] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCheckIn = async () => {
    setLoading(true);

    // 1. Get user's location
    const position = await getCurrentPosition();

    // 2. Calculate distance from venue
    const distance = calculateDistance(
      position.coords.latitude,
      position.coords.longitude,
      venue.latitude,
      venue.longitude
    );

    // 3. Verify within 100 meters
    if (distance > 100) {
      toast.error('You must be at the venue to check in');
      setLoading(false);
      return;
    }

    // 4. Create check-in record
    const { data, error } = await supabase
      .from('venue_check_ins')
      .insert({
        user_id: user.id,
        venue_id: venue.id,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        table_number: tableNumber,
        is_visible_to_guests: isVisible,
        status: 'active'
      })
      .select()
      .single();

    if (!error) {
      onCheckIn(data);
      toast.success('Checked in successfully!');
    }

    setLoading(false);
  };

  return (
    <Dialog open={true}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Welcome to {venue.name}! 🎉</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="table">Table Number (Optional)</Label>
            <Input
              id="table"
              placeholder="e.g. 5"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
            />
          </div>

          <label className="flex items-center gap-2">
            <Checkbox
              checked={isVisible}
              onCheckedChange={setIsVisible}
            />
            Make me visible to other guests
          </label>

          <p className="text-sm text-gray-400">
            Checking in will give you access to mobile ordering, AI waiter, and social features.
          </p>

          <Button onClick={handleCheckIn} disabled={loading} className="w-full">
            {loading ? 'Checking In...' : 'Check In Now'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

### In-Venue Experience

```tsx
export function InVenueExperience({ checkIn, venue }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-slate-900 to-slate-800">
      {/* Header */}
      <div className="p-6 bg-black/30 backdrop-blur">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">{venue.name}</h1>
            <p className="text-sm text-gray-400">
              Table {checkIn.table_number || 'N/A'}
            </p>
          </div>
          <Button variant="outline" onClick={handleCheckOut}>
            Check Out
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-6 grid grid-cols-2 gap-4">
        <QuickActionCard
          icon={MessageCircle}
          title="AI Waiter"
          description="Ask menu questions"
          onClick={() => navigate(`/venue/${venue.id}/ai-waiter`)}
        />
        <QuickActionCard
          icon={ShoppingCart}
          title="Order"
          description="From your phone"
          onClick={() => navigate(`/venue/${venue.id}/order`)}
        />
        <QuickActionCard
          icon={Users}
          title="See Guests"
          description="Who's here"
          onClick={() => navigate(`/venue/${venue.id}/guests`)}
        />
        <QuickActionCard
          icon={Hand}
          title="Call Waiter"
          description="Request service"
          onClick={handleCallWaiter}
        />
      </div>

      {/* Seating Map */}
      <Card className="m-6">
        <CardHeader>
          <CardTitle>Venue Layout</CardTitle>
        </CardHeader>
        <CardContent>
          <FloorplanView
            floorplan={venue.floorplan}
            currentTable={checkIn.table_number}
          />
        </CardContent>
      </Card>

      {/* Other Guests (if visible) */}
      {checkIn.is_visible_to_guests && (
        <Card className="m-6">
          <CardHeader>
            <CardTitle>Other Guests</CardTitle>
          </CardHeader>
          <CardContent>
            <GuestList venueId={venue.id} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
```

---

## COMPLETION STATUS

### V2 Features: 0% Complete (Foundation Ready)

**Foundation (Complete):**
- ✅ Database schema includes all V2 features
- ✅ TypeScript types for all V2 features
- ✅ Complete specifications documented

**Not Started (Ready to Build):**
- ⏳ Pages 5-13 (Orders, Menu, Tables, Floorplan, Inventory, Sales, Analytics, Staff, Settings)
- ⏳ Employee invitation system
- ⏳ Employee shift mode
- ⏳ Check-in system (geolocation)
- ⏳ In-venue experience (vibe-sphere UI)
- ⏳ AI waiter integration
- ⏳ Remote ordering (pickup/delivery/dine-in)
- ⏳ Push notifications ad system

---

## HANDOFF NOTES FOR NEXT AGENT

**Date:** 2025-11-18
**Session:** Foundation Complete
**Session ID:** claude/build-complete-pos-system-01DTeM1ZTUdckFYiXNWtipDG
**Next Agent Should:**

1. **FIRST:** Read POS_IMPLEMENTATION_HANDOFF.md (Complete guide)
2. **THEN:** Complete foundation tasks from MASTER_POS_SETUP.md (Auth contexts, etc.)
3. **NEXT:** Build core POS pages (1-4) from MASTER_POS_SETUP.md
4. **AFTER THAT:** Build pages 5-13 from this document (V2_ADDITIONS.md)
5. **THEN:** Implement employee system (detailed specs in this doc)
6. **NEXT:** Build enduser check-in experience (specs in this doc)
7. **THEN:** Add remote ordering features (specs in this doc)
8. **FINALLY:** Implement push notification system (specs in this doc)

**Critical Reminders:**
- ✅ All V2 features are in the database schema already
- ✅ All types are defined in database.types.ts
- 📖 All specifications in this document are REQUIRED, not optional
- 🔄 Update completion status in BOTH master documents after each session
- ✅ Test each feature thoroughly before moving to next
- 🚨 Keep database schema consistent - it's final!
- 📝 Every page has complete code examples and specifications

**Priority Order:**
1. Core POS pages (1-4) - See MASTER_POS_SETUP.md
2. Additional POS pages (5-13) - See this document
3. Employee system - See this document
4. Enduser experience - See this document
5. Remote ordering - See this document
6. Push notifications - See this document

---

**END OF MASTER_POS_SETUP_V2_ADDITIONS.md**

**REMEMBER:** Update this document after each work session!

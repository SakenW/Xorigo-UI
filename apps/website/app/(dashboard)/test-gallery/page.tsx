export default function TestGallery() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">测试 Gallery 路由</h1>
      <p>如果你能看到这个页面，说明路由工作正常。</p>
      <div className="mt-4 p-4 bg-gray-100 rounded">
        <p>当前路径: /test-gallery</p>
        <p>时间: {new Date().toLocaleString()}</p>
      </div>
    </div>
  )
}
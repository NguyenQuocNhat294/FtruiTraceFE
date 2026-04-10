import React, { useEffect, useMemo, useState } from "react";
import { inspectionService } from "../../services/inspectionService";

function InspectionsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    batchcode: "",
    inspector: "",
    result: "pending",
    note: "",
  });

  const fetchInspections = async () => {
    setLoading(true);
    try {
      const res = await inspectionService.getAll();
      setItems(res.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInspections();
  }, []);

  const summary = useMemo(() => {
    const pass = items.filter((i) => i.result === "pass").length;
    const fail = items.filter((i) => i.result === "fail").length;
    const pending = items.filter((i) => i.result === "pending").length;
    return { pass, fail, pending };
  }, [items]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.batchcode || !form.inspector) return;

    if (editingId) {
      await inspectionService.update(editingId, form);
    } else {
      await inspectionService.create(form);
    }

    await fetchInspections();
    setEditingId(null);
    setForm({ batchcode: "", inspector: "", result: "pending", note: "" });
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setForm({
      batchcode: item.batchcode || "",
      inspector: item.inspector || "",
      result: item.result || "pending",
      note: item.note || "",
    });
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Xóa phiếu ${item.inspectionCode || item.id}?`)) return;
    await inspectionService.delete(item._id);
    await fetchInspections();
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Kiểm định & chứng nhận</h1>
        <p className="text-gray-500 mt-1">
          Quản lý phiếu kiểm định cho từng lô hàng trước khi phân phối.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MiniStat title="Đạt chuẩn" value={summary.pass} color="text-emerald-600" />
        <MiniStat title="Không đạt" value={summary.fail} color="text-red-600" />
        <MiniStat title="Chờ duyệt" value={summary.pending} color="text-amber-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Tạo phiếu kiểm định</h2>
          <form onSubmit={onSubmit} className="space-y-3">
            <Field label="Mã lô">
              <input
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm"
                value={form.batchcode}
                onChange={(e) => setForm((p) => ({ ...p, batchcode: e.target.value }))}
                placeholder="VD: BATCH-003"
              />
            </Field>
            <Field label="Kiểm định viên">
              <input
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm"
                value={form.inspector}
                onChange={(e) => setForm((p) => ({ ...p, inspector: e.target.value }))}
                placeholder="Họ tên người kiểm định"
              />
            </Field>
            <Field label="Kết quả">
              <select
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm"
                value={form.result}
                onChange={(e) => setForm((p) => ({ ...p, result: e.target.value }))}
              >
                <option value="pass">Đạt chuẩn</option>
                <option value="pending">Chờ duyệt</option>
                <option value="fail">Không đạt</option>
              </select>
            </Field>
            <Field label="Ghi chú">
              <textarea
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm"
                rows={3}
                value={form.note}
                onChange={(e) => setForm((p) => ({ ...p, note: e.target.value }))}
              />
            </Field>
            <button
              type="submit"
              className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl text-sm font-semibold"
            >
              {editingId ? "Cập nhật phiếu kiểm định" : "Lưu phiếu kiểm định"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm({
                    batchcode: "",
                    inspector: "",
                    result: "pending",
                    note: "",
                  });
                }}
                className="w-full py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700"
              >
                Hủy chỉnh sửa
              </button>
            )}
          </form>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="p-4 font-semibold text-gray-600">Mã phiếu</th>
                <th className="p-4 font-semibold text-gray-600">Mã lô</th>
                <th className="p-4 font-semibold text-gray-600">Kiểm định viên</th>
                <th className="p-4 font-semibold text-gray-600">Kết quả</th>
                <th className="p-4 font-semibold text-gray-600">Ngày</th>
                <th className="p-4 font-semibold text-gray-600 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-400">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-400">
                    Chưa có phiếu kiểm định.
                  </td>
                </tr>
              ) : items.map((item) => (
                <tr key={item._id || item.id} className="hover:bg-gray-50">
                  <td className="p-4 font-mono font-semibold text-gray-800">{item.inspectionCode || item.id}</td>
                  <td className="p-4 text-gray-700">{item.batchcode}</td>
                  <td className="p-4 text-gray-700">{item.inspector}</td>
                  <td className="p-4">
                    <ResultBadge result={item.result} />
                  </td>
                  <td className="p-4 text-gray-600">{formatDate(item.date || item.createdAt)}</td>
                  <td className="p-4 text-right">
                    <div className="inline-flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(item)}
                        className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold hover:bg-gray-50"
                      >
                        Sửa
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(item)}
                        className="px-3 py-1.5 rounded-lg border border-red-200 text-red-600 text-xs font-semibold hover:bg-red-50"
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return "N/A";
  return new Date(dateStr).toLocaleDateString("vi-VN");
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-xs text-gray-600">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

function MiniStat({ title, value, color }) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
      <p className="text-xs text-gray-500">{title}</p>
      <p className={`text-xl font-bold mt-1 ${color}`}>{value}</p>
    </div>
  );
}

function ResultBadge({ result }) {
  if (result === "pass") {
    return (
      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
        Đạt chuẩn
      </span>
    );
  }
  if (result === "fail") {
    return (
      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
        Không đạt
      </span>
    );
  }
  return (
    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
      Chờ duyệt
    </span>
  );
}

export default InspectionsPage;


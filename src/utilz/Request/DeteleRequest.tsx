/** @format */

export const DeleteRequestWithCre = async ({
  route,
  accesstoken,
  refreshtoken,
}: {
  route: string;
  accesstoken: string | null;
  refreshtoken: string | null;
}) => {
  try {
    if (accesstoken && refreshtoken) {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL_SERVER}/${route}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accesstoken}`,
            "X-refresh-token": refreshtoken,
          },
          credentials: "include",
        }
      );
      if (response.ok) {
        return { success: true, data: await response.json(), response };
      } else {
        const data = await response.json();
        throw new Error((await data?.msg) || " Lấy dữ liệu ko thành công");
      }
    } else throw new Error("Xác thực không thành công");
  } catch (e) {
    if (e instanceof Error) {
      return { success: false, msg: e.message };
    } else return { success: false, msg: "Lỗi khi lấy dữ liệu" };
  }
};

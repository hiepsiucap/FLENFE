/** @format */

export const PatchRequest = async ({
  route,
  body,
}: {
  route: string;
  body: object;
}) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL_SERVER}/${route}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );
    if (response.ok) {
      return { success: true, data: await response.json(), response };
    } else {
      const data = await response.json();
      throw new Error((await data?.msg) || " Lấy dữ liệu ko thành công");
    }
  } catch (e) {
    if (e instanceof Error) {
      return { success: false, msg: e.message };
    } else return { success: false, msg: "Lỗi khi lấy dữ liệu" };
  }
};
export const PatchRequestWithCre = async ({
  route,
  body,
  accesstoken,
  refreshtoken,
}: {
  route: string;
  body: object;
  accesstoken: string | null;
  refreshtoken: string | null;
}) => {
  console.log("Gửi thành công");
  try {
    if (accesstoken && refreshtoken) {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL_SERVER}/${route}`,

        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accesstoken}`, // Properly format Authorization header
            "X-refresh-token": refreshtoken,
          },
          credentials: "include",
          body: JSON.stringify(body),
        }
      );
      if (response.ok) {
        return { success: true, data: await response.json() };
      } else {
        const data = await response.json();
        throw new Error((await data?.msg) || " Lấy dữ liệu ko thành công");
      }
    } else throw new Error("Xác thực thất bại vui lòng thử lại");
  } catch (e) {
    if (e instanceof Error) {
      return { success: false, msg: e.message };
    } else return { success: false, msg: "Lỗi khi lấy dữ liệu" };
  }
};
export const GetPostRequestFormDataWithCre = async ({
  route,
  formdata,
  accesstoken,
  refreshtoken,
}: {
  route: string;
  formdata: FormData;
  accesstoken: string | null;
  refreshtoken: string | null;
}) => {
  try {
    if (accesstoken && refreshtoken) {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL_SERVER}/${route}`,

        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accesstoken}`, // Properly format Authorization header
            "X-refresh-token": refreshtoken,
          },
          credentials: "include",
          body: formdata,
        }
      );
      if (response.ok) {
        return { success: true, data: await response.json() };
      } else {
        const data = await response.json();
        throw new Error((await data?.msg) || " Lấy dữ liệu ko thành công");
      }
    } else throw new Error("Xác thực thất bại vui lòng thử lại");
  } catch (e) {
    if (e instanceof Error) {
      return { success: false, msg: e.message };
    } else return { success: false, msg: "Lỗi khi lấy dữ liệu" };
  }
};

import axios, { AxiosError, AxiosResponse } from 'axios';
import { QuizType } from '../Types/QuizType';
import { FolderType } from '../Types/FolderType';
//import { Quiz } from '@mui/icons-material';

//import { v4 as uuidv4 } from 'uuid';



class ApiService {
    private BASE_URL: string;

    constructor() {
        this.BASE_URL = `http://localhost:4400`;
    }

    // Helpers
    private saveToken(token: string): void {
        localStorage.setItem("jwt", token);
    }

    private getToken(): string | null {
        return localStorage.getItem("jwt");
    }

    public isLogedIn(): boolean {
        const token = this.getToken()

        if (token == null) {
            return false;
        }

        return true;
    }

    public logout(): void {
        return localStorage.removeItem("jwt");
    }

    // User Routes
    public async register(email: string, password: string): Promise<any> {
        try {
            const url: string = `${this.BASE_URL}/user/register`;

            const headers = {
                'Content-Type': 'application/json'
            };

            const body = {
                email: email,
                password: password
            };

            const result: AxiosResponse = await axios.post(url, body, { headers: headers });

            if (result.data.code != 200) return result.data.message;

            return true;

        } catch (error) {

            if (axios.isAxiosError(error)) {
                const err = error as AxiosError;
                const data = err.response?.data as { message: string } | undefined;
                return data?.message;
            }
        }
    }

    public async login(email: string, password: string): Promise<any> {
        try {
            const url: string = `${this.BASE_URL}/user/login`;

            const headers = {
                'Content-Type': 'application/json'
            };

            const body = {
                email: email,
                password: password
            };

            const result: AxiosResponse = await axios.post(url, body, { headers: headers });

            if (result.data.code != 200) return result.data.message;

            this.saveToken(result.data.results.token);

            return true;

        } catch (error) {

            if (axios.isAxiosError(error)) {
                const err = error as AxiosError;
                const data = err.response?.data as { message: string } | undefined;
                return data?.message;
            }
        }
    }

    public async resetPassword(email: string): Promise<any> {
        try {
            const url: string = `${this.BASE_URL}/user/reset-password`;

            const headers = {
                'Content-Type': 'application/json'
            };

            const body = {
                email: email
            };

            const result: AxiosResponse = await axios.post(url, body, { headers: headers });

            if (result.data.code != 200) return result.data.message;

            return true;

        } catch (error) {

            if (axios.isAxiosError(error)) {
                const err = error as AxiosError;
                const data = err.response?.data as { message: string } | undefined;
                return data?.message;
            }
        }
    }

    public async changePassword(email: string, oldPassword: string, newPassword: string): Promise<void> {
        const url: string = `${this.BASE_URL}/user/change-password`;
        const headers = {
            Authorization: `Bearer ${this.getToken()}`,
            'Content-Type': 'application/json'
        };
        const body = {
            email: email,
            oldPassword: oldPassword,
            newPassword: newPassword
        };

        const result: AxiosResponse = await axios.post(url, body, { headers: headers });
        console.log(result);
        // code == 200
    }

    public async deleteUser(email: string, password: string): Promise<void> {
        const url: string = `${this.BASE_URL}/user/delete-user`;
        const headers = {
            Authorization: `Bearer ${this.getToken()}`,
            'Content-Type': 'application/json'
        };
        const body = {
            email: email,
            password: password
        };

        const result: AxiosResponse = await axios.delete(url, { data: body, headers: headers });
        console.log(result);
        // code == 200
    }

    // Folder Routes
    public async createFolder(title: string): Promise<void> {
        const url: string = `${this.BASE_URL}/folder/create`;
        const headers = {
            Authorization: `Bearer ${this.getToken()}`,
            'Content-Type': 'application/json'
        };
        const body = {
            title: title
        };

        const result: AxiosResponse = await axios.post(url, body, { headers: headers });
        console.log(result);
        // code == 200
    }


    public async getUserFolders(): Promise<FolderType[]> {
        const url: string = `${this.BASE_URL}/folder/getUserFolders`;
        const headers = {
            Authorization: `Bearer ${this.getToken()}`,
            'Content-Type': 'application/json'
        };
        try {
            const response: AxiosResponse = await axios.get(url, { headers: headers });
            if (response.status === 200) {
                return response.data.results.map((folder: FolderType) => ({ _id: folder._id, title: folder.title }));
            } else {
                throw new Error('Failed to fetch user folders');
            }
        } catch (error) {
            console.error('Error fetching user folders:', error);
            throw error; // Optional: rethrow the error to handle it elsewhere
        }
    }

    public async getFolderContent(folderId: string): Promise<QuizType[]> {
        const url: string = `${this.BASE_URL}/folder/getFolderContent/${folderId}`;
        const headers = {
            Authorization: `Bearer ${this.getToken()}`,
            'Content-Type': 'application/json'
        };

        try {
            const response: AxiosResponse = await axios.get(url, { headers: headers });
            if (response.status === 200) {
                // Assuming the response contains a list of quizzes
                return response.data.results.map((quiz: QuizType) => ({ _id: quiz._id, title: quiz.title }));
            } else {
                throw new Error('Failed to fetch folder content');
            }
        } catch (error) {
            console.error('Error fetching folder content:', error);
            throw error;
        }
    }

    public async deleteFolder(folderId: string): Promise<void> {
        const url: string = `${this.BASE_URL}/folder/delete/${folderId}`;
        const headers = {
            Authorization: `Bearer ${this.getToken()}`,
            'Content-Type': 'application/json'
        };

        const result: AxiosResponse = await axios.delete(url, { headers: headers });
        console.log(result);
        // code == 200
    }

    public async renameFolder(folderId: string, newTitle: string): Promise<void> {
        const url: string = `${this.BASE_URL}/folder/rename`;
        const headers = {
            Authorization: `Bearer ${this.getToken()}`,
            'Content-Type': 'application/json'
        };
        const body = {
            folderId: folderId,
            newTitle: newTitle
        };

        const result: AxiosResponse = await axios.put(url, body, { headers: headers });
        console.log(result);
        // code == 200
    }

    // Quiz Routes
    public async createQuiz(title: string, content: string[], folderId: string): Promise<void> {
        const url: string = `${this.BASE_URL}/quiz/create`;
        const headers = {
            Authorization: `Bearer ${this.getToken()}`,
            'Content-Type': 'application/json'
        };
        const body = {
            title: title,
            content: content,
            folderId: folderId
        };

        try {
            const result: AxiosResponse = await axios.post(url, body, { headers: headers });
            console.log(result);
            // code == 200
        } catch (error) {
            console.error('Error creating quiz:', error);
            throw error; // Optional: rethrow the error to handle it elsewhere
        }
    }

    // Quiz Routes
    public async duplicateQuiz(quizId: string, folderId: string): Promise<void> {
        const url: string = `${this.BASE_URL}/quiz/duplicate`;
        const headers = {
            Authorization: `Bearer ${this.getToken()}`,
            'Content-Type': 'application/json'
        };
        const body = {
            quizId: quizId,
            folderId: folderId
        };

        try {
            const result: AxiosResponse = await axios.post(url, body, { headers: headers });
            console.log(result);
            // code == 200
        } catch (error) {
            console.error('Error duplicating quiz:', error);
            throw error; // Optional: rethrow the error to handle it elsewhere
        }
    }


    public async getQuiz(quizId: string): Promise<QuizType> {
        const url: string = `${this.BASE_URL}/quiz/get/${quizId}`;
        const headers = {
            Authorization: `Bearer ${this.getToken()}`,
            'Content-Type': 'application/json'
        };

        try {
            const result: AxiosResponse = await axios.get(url, { headers: headers });
            //console.log(result);
            // Assuming result.data contains the quiz information

            return result.data.results as QuizType;
        } catch (error) {
            console.error('Error getting quiz:', error);
            throw error; // Optional: rethrow the error to handle it elsewhere
        }
    }

    public async deleteQuiz(quizId: string): Promise<void> {
        const url: string = `${this.BASE_URL}/quiz/delete/${quizId}`;
        const headers = {
            Authorization: `Bearer ${this.getToken()}`,
            'Content-Type': 'application/json'
        };

        try {
            const result: AxiosResponse = await axios.delete(url, { headers: headers });
            console.log(result);
            // code == 200
        } catch (error) {
            console.error('Error deleting quiz:', error);
            throw error; // Optional: rethrow the error to handle it elsewhere
        }
    }

    public async updateQuiz(quizId: string, newTitle: string, newContent: string[]): Promise<void> {
        const url: string = `${this.BASE_URL}/quiz/update`;
        const headers = {
            Authorization: `Bearer ${this.getToken()}`,
            'Content-Type': 'application/json'
        };
        const body = {
            quizId: quizId,
            newTitle: newTitle,
            newContent: newContent
        };

        try {
            const result: AxiosResponse = await axios.put(url, body, { headers: headers });
            console.log(result);
            // code == 200
        } catch (error) {
            console.error('Error updating quiz:', error);
            throw error; // Optional: rethrow the error to handle it elsewhere
        }
    }

    public async moveQuiz(quizId: string, newFolderId: string): Promise<void> {
        const url: string = `${this.BASE_URL}/quiz/move`;
        const headers = {
            Authorization: `Bearer ${this.getToken()}`,
            'Content-Type': 'application/json'
        };
        const body = {
            quizId: quizId,
            newFolderId: newFolderId
        };

        const result: AxiosResponse = await axios.put(url, body, { headers: headers });
        console.log(result);
        // code == 200
    }


    // Images Route
    public async uploadImage(image: File): Promise<string> {
        const url: string = `${this.BASE_URL}/image/upload`;
        const headers = {
            Authorization: `Bearer ${this.getToken()}`,
            'Content-Type': 'multipart/form-data'
        };

        const formData = new FormData();
        formData.append('image', image);

        const result: AxiosResponse = await axios.post(url, formData, { headers: headers });
        console.log(result);
        // TODO: code 200 = ok
        // TODO: get results.id to create the URL

        const id = result.data.results.id; // Assuming the response contains the ID of the uploaded image

        return `${this.BASE_URL}/image/get/` + id;
    }
    // Images Route
    public async getImage(imageId: string): Promise<string> {
        const url: string = `${this.BASE_URL}/image/get/${imageId}`;
        const headers = {
            Authorization: `Bearer ${this.getToken()}`,
            'Content-Type': 'application/json'
        };

        const result: AxiosResponse = await axios.get(url, { headers: headers });
        console.log(result);
        // TODO: Traiter la réponse selon les besoins de votre application
        return result.data.url; // Supposons que la réponse contienne l'URL de l'image
    }

    public async deleteImage(imageId: string): Promise<void> {
        const url: string = `${this.BASE_URL}/image/delete/${imageId}`;
        const headers = {
            Authorization: `Bearer ${this.getToken()}`,
            'Content-Type': 'application/json'
        };

        const result: AxiosResponse = await axios.delete(url, { headers: headers });
        console.log(result);
        // TODO: Traiter la réponse selon les besoins de votre application
        // code == 200
    }

    public async getUserImages(): Promise<string[]> {
        const url: string = `${this.BASE_URL}/image/getUserImages`;
        const headers = {
            Authorization: `Bearer ${this.getToken()}`,
            'Content-Type': 'application/json'
        };

        const result: AxiosResponse = await axios.get(url, { headers: headers });
        console.log(result);
        // TODO: Traiter la réponse selon les besoins de votre application
        return result.data.images; // Supposons que la réponse contienne un tableau d'URLs d'images
    }
}


const apiService = new ApiService();
export default apiService;

import axios, { AxiosError, AxiosResponse } from 'axios';
import { ENV_VARIABLES } from '../constants';

import { QuizType } from '../Types/QuizType';
import { FolderType } from '../Types/FolderType';

class ApiService {
    private BASE_URL: string;
    private TTL: number;

    constructor() {
        this.BASE_URL = ENV_VARIABLES.VITE_BACKEND_URL;
        this.TTL = 3600000; // 1h
    }

    private constructRequestUrl(endpoint: string): string {
        return `http://${this.BASE_URL}${endpoint}`;
    }

    private constructRequestHeaders(): any {
        if (this.isLogedIn()) {
            return {
                Authorization: `Bearer ${this.getToken()}`,
                'Content-Type': 'application/json'
            };
        }
        else {
            return {
                'Content-Type': 'application/json'
            };
        }
    }

    // Helpers
    private saveToken(token: string): void {
        const now = new Date();

        const object = {
            token: token,
            expiry: now.getTime() + this.TTL
        }

        localStorage.setItem("jwt", JSON.stringify(object));
    }

    private getToken(): string | null {
        const objectStr = localStorage.getItem("jwt");

        if (!objectStr) {
            return null
        }

        const object = JSON.parse(objectStr)
        const now = new Date()

        if (now.getTime() > object.expiry) {
            // If the item is expired, delete the item from storage
            // and return null
            this.logout();
            return null
        }

        return object.token;
    }

    public isLogedIn(): boolean {
        const token = this.getToken()

        if (token == null) {
            return false;
        }

        // Update token expiry
        this.saveToken(token);

        return true;
    }

    public logout(): void {
        return localStorage.removeItem("jwt");
    }

    // User Routes

    /**
     * @returns true if  successful 
     * @returns A error string if unsuccessful,
     */
    public async register(email: string, password: string): Promise<any> {
        try {

            if (!email || !password) {
                throw new Error(`L'email et le mot de passe sont requis.`);
            }

            const url: string = this.constructRequestUrl(`/user/register`);
            const headers = this.constructRequestHeaders();
            const body = { email, password };

            const result: AxiosResponse = await axios.post(url, body, { headers: headers });

            if (result.status !== 200) {
                throw new Error(`L'enregistrement a échoué. Status: ${result.status}`);
            }

            return true;

        } catch (error) {
            console.log("Error details: ", error);

            if (axios.isAxiosError(error)) {
                const err = error as AxiosError;
                const data = err.response?.data as { error: string } | undefined;
                return data?.error || 'Erreur serveur inconnue lors de la requête.';
            }

            return `Une erreur inattendue s'est produite.`
        }
    }

    /**
     * @returns true if  successful 
     * @returns A error string if unsuccessful,
     */
    public async login(email: string, password: string): Promise<any> {
        try {

            if (!email || !password) {
                throw new Error(`L'email et le mot de passe sont requis.`);
            }

            const url: string = this.constructRequestUrl(`/user/login`);
            const headers = this.constructRequestHeaders();
            const body = { email, password };

            const result: AxiosResponse = await axios.post(url, body, { headers: headers });

            if (result.status !== 200) {
                throw new Error(`La connexion a échoué. Status: ${result.status}`);
            }

            this.saveToken(result.data.token);

            return true;

        } catch (error) {
            console.log("Error details: ", error);

            if (axios.isAxiosError(error)) {
                const err = error as AxiosError;
                const data = err.response?.data as { error: string } | undefined;
                return data?.error || 'Erreur serveur inconnue lors de la requête.';
            }

            return `Une erreur inattendue s'est produite.`
        }
    }

    /**
     * @returns true if  successful 
     * @returns A error string if unsuccessful,
     */
    public async resetPassword(email: string): Promise<any> {
        try {

            if (!email) {
                throw new Error(`L'email est requis.`);
            }

            const url: string = this.constructRequestUrl(`/user/reset-password`);
            const headers = this.constructRequestHeaders();
            const body = { email };

            const result: AxiosResponse = await axios.post(url, body, { headers: headers });

            if (result.status !== 200) {
                throw new Error(`Échec de la réinitialisation du mot de passe. Status: ${result.status}`);
            }

            return true;

        } catch (error) {
            console.log("Error details: ", error);

            if (axios.isAxiosError(error)) {
                const err = error as AxiosError;
                const data = err.response?.data as { error: string } | undefined;
                return data?.error || 'Erreur serveur inconnue lors de la requête.';
            }

            return `Une erreur inattendue s'est produite.`
        }
    }

    /**
     * @returns true if  successful 
     * @returns A error string if unsuccessful,
     */
    public async changePassword(email: string, oldPassword: string, newPassword: string): Promise<any> {
        try {

            if (!email || !oldPassword || !newPassword) {
                throw new Error(`L'email, l'ancien et le nouveau mot de passe sont requis.`);
            }

            const url: string = this.constructRequestUrl(`/user/change-password`);
            const headers = this.constructRequestHeaders();
            const body = { email, oldPassword, newPassword };

            const result: AxiosResponse = await axios.post(url, body, { headers: headers });

            if (result.status !== 200) {
                throw new Error(`Le changement du mot de passe a échoué. Status: ${result.status}`);
            }

            return true;

        } catch (error) {
            console.log("Error details: ", error);

            if (axios.isAxiosError(error)) {
                const err = error as AxiosError;
                const data = err.response?.data as { error: string } | undefined;
                return data?.error || 'Erreur serveur inconnue lors de la requête.';
            }

            return `Une erreur inattendue s'est produite.`
        }
    }

    /**
     * @returns true if  successful 
     * @returns A error string if unsuccessful,
     */
    public async deleteUser(email: string, password: string): Promise<any> {
        try {

            if (!email || !password) {
                throw new Error(`L'email et le mot de passe sont requis.`);
            }

            const url: string = this.constructRequestUrl(`/user/delete-user`);
            const headers = this.constructRequestHeaders();
            const body = { email, password };

            const result: AxiosResponse = await axios.post(url, body, { headers: headers });

            if (result.status !== 200) {
                throw new Error(`La supression du compte a échoué. Status: ${result.status}`);
            }

            return true;

        } catch (error) {
            console.log("Error details: ", error);

            if (axios.isAxiosError(error)) {
                const err = error as AxiosError;
                const data = err.response?.data as { error: string } | undefined;
                return data?.error || 'Erreur serveur inconnue lors de la requête.';
            }

            return `Une erreur inattendue s'est produite.`
        }
    }

    // Folder Routes

    /**
     * @returns true if successful 
     * @returns A error string if unsuccessful,
     */
    public async createFolder(title: string): Promise<any> {
        try {

            if (!title) {
                throw new Error(`Le titre est requis.`);
            }

            const url: string = this.constructRequestUrl(`/folder/create`);
            const headers = this.constructRequestHeaders();
            const body = { title };

            const result: AxiosResponse = await axios.post(url, body, { headers: headers });

            if (result.status !== 200) {
                throw new Error(`La création du dossier a échoué. Status: ${result.status}`);
            }

            return true;

        } catch (error) {
            console.log("Error details: ", error);

            if (axios.isAxiosError(error)) {
                const err = error as AxiosError;
                const data = err.response?.data as { error: string } | undefined;
                return data?.error || 'Erreur serveur inconnue lors de la requête.';
            }

            return `Une erreur inattendue s'est produite.`
        }
    }

    /**
     * @returns folder array if successful 
     * @returns A error string if unsuccessful,
     */
    public async getUserFolders(): Promise<FolderType[] | string> {
        try {

            // No params

            const url: string = this.constructRequestUrl(`/folder/getUserFolders`);
            const headers = this.constructRequestHeaders();

            const result: AxiosResponse = await axios.get(url, { headers: headers });

            if (result.status !== 200) {
                throw new Error(`L'obtention des dossiers utilisateur a échoué. Status: ${result.status}`);
            }

            return result.data.data.map((folder: FolderType) => ({ _id: folder._id, title: folder.title }));

        } catch (error) {
            console.log("Error details: ", error);

            if (axios.isAxiosError(error)) {
                const err = error as AxiosError;
                const data = err.response?.data as { error: string } | undefined;
                return data?.error || 'Erreur serveur inconnue lors de la requête.';
            }

            return `Une erreur inattendue s'est produite.`
        }
    }

    /**
     * @returns quiz array if successful 
     * @returns A error string if unsuccessful,
     */
    public async getFolderContent(folderId: string): Promise<QuizType[] | string> {
        try {

            if (!folderId) {
                throw new Error(`Le folderId est requis.`);
            }

            const url: string = this.constructRequestUrl(`/folder/getFolderContent/${folderId}`);
            const headers = this.constructRequestHeaders();

            const result: AxiosResponse = await axios.get(url, { headers: headers });

            if (result.status !== 200) {
                throw new Error(`L'obtention des quiz du dossier a échoué. Status: ${result.status}`);
            }

            return result.data.data.map((quiz: QuizType) => ({ _id: quiz._id, title: quiz.title, content: quiz.content }));

        } catch (error) {
            console.log("Error details: ", error);

            if (axios.isAxiosError(error)) {
                const err = error as AxiosError;
                const data = err.response?.data as { error: string } | undefined;
                return data?.error || 'Erreur serveur inconnue lors de la requête.';
            }

            return `Une erreur inattendue s'est produite.`
        }
    }

    /**
     * @returns true if successful 
     * @returns A error string if unsuccessful,
     */
    public async deleteFolder(folderId: string): Promise<any> {
        try {

            if (!folderId) {
                throw new Error(`Le folderId est requis.`);
            }

            const url: string = this.constructRequestUrl(`/folder/delete/${folderId}`);
            const headers = this.constructRequestHeaders();

            const result: AxiosResponse = await axios.delete(url, { headers: headers });

            if (result.status !== 200) {
                throw new Error(`La supression du dossier a échoué. Status: ${result.status}`);
            }

            return true;

        } catch (error) {
            console.log("Error details: ", error);

            if (axios.isAxiosError(error)) {
                const err = error as AxiosError;
                const data = err.response?.data as { error: string } | undefined;
                return data?.error || 'Erreur serveur inconnue lors de la requête.';
            }

            return `Une erreur inattendue s'est produite.`
        }
    }

    /**
     * @returns true if successful 
     * @returns A error string if unsuccessful,
     */
    public async renameFolder(folderId: string, newTitle: string): Promise<any> {
        try {

            if (!folderId || !newTitle) {
                throw new Error(`Le folderId et le nouveau titre sont requis.`);
            }

            const url: string = this.constructRequestUrl(`/folder/rename`);
            const headers = this.constructRequestHeaders();
            const body = { folderId, newTitle };

            const result: AxiosResponse = await axios.put(url, body, { headers: headers });
            if (result.status !== 200) {
                throw new Error(`Le changement de nom de dossier a échoué. Status: ${result.status}`);
            }

            return true;

        } catch (error) {
            console.log("Error details: ", error);

            if (axios.isAxiosError(error)) {
                const err = error as AxiosError;
                const data = err.response?.data as { error: string } | undefined;
                return data?.error || 'Erreur serveur inconnue lors de la requête.';
            }

            return `Une erreur inattendue s'est produite.`
        }
    }

    public async duplicateFolder(folderId: string): Promise<any> {
        try {
            if (!folderId) {
                throw new Error(`Le folderId et le nouveau titre sont requis.`);
            }

            const url: string = this.constructRequestUrl(`/folder/duplicate`);
            const headers = this.constructRequestHeaders();
            const body = { folderId };

            console.log(headers);
            const result: AxiosResponse = await axios.post(url, body, { headers: headers });

            if (result.status !== 200) {
                throw new Error(`La duplication du dossier a échoué. Status: ${result.status}`);
            }

            return true;

        } catch (error) {
            console.log("Error details: ", error);

            if (axios.isAxiosError(error)) {
                const err = error as AxiosError;
                const data = err.response?.data as { error: string } | undefined;
                return data?.error || 'Erreur serveur inconnue lors de la requête.';
            }

            return `Une erreur inattendue s'est produite.`
        }
    }

    public async copyFolder(folderId: string, newTitle: string): Promise<any> {
        try {
            if (!folderId || !newTitle) {
                throw new Error(`Le folderId et le nouveau titre sont requis.`);
            }

            const url: string = this.constructRequestUrl(`/folder/copy/${folderId}`);
            const headers = this.constructRequestHeaders();
            const body = { newTitle };

            const result: AxiosResponse = await axios.post(url, body, { headers: headers });

            if (result.status !== 200) {
                throw new Error(`La copie du dossier a échoué. Status: ${result.status}`);
            }

            return true;

        } catch (error) {
            console.log("Error details: ", error);

            if (axios.isAxiosError(error)) {
                const err = error as AxiosError;
                const data = err.response?.data as { error: string } | undefined;
                return data?.error || 'Erreur serveur inconnue lors de la requête.';
            }

            return `Une erreur inattendue s'est produite.`
        }
    }

    // Quiz Routes

    /**
     * @returns true if successful 
     * @returns A error string if unsuccessful,
     */
    public async createQuiz(title: string, content: string[], folderId: string): Promise<any> {
        try {

            if (!title || !content || !folderId) {
                throw new Error(`Le titre, les contenu et le dossier de destination sont requis.`);
            }

            const url: string = this.constructRequestUrl(`/quiz/create`);
            const headers = this.constructRequestHeaders();
            const body = { title, content, folderId };

            const result: AxiosResponse = await axios.post(url, body, { headers: headers });

            if (result.status !== 200) {
                throw new Error(`La création du quiz a échoué. Status: ${result.status}`);
            }

            return true;

        } catch (error) {
            console.log("Error details: ", error);

            if (axios.isAxiosError(error)) {
                const err = error as AxiosError;
                const data = err.response?.data as { error: string } | undefined;
                return data?.error || 'Erreur serveur inconnue lors de la requête.';
            }

            return `Une erreur inattendue s'est produite.`
        }
    }

    /**
     * @returns quiz if successful 
     * @returns A error string if unsuccessful,
     */
    public async getQuiz(quizId: string): Promise<QuizType | string> {
        try {

            if (!quizId) {
                throw new Error(`Le quizId est requis.`);
            }

            const url: string = this.constructRequestUrl(`/quiz/get/${quizId}`);
            const headers = this.constructRequestHeaders();

            const result: AxiosResponse = await axios.get(url, { headers: headers });

            if (result.status !== 200) {
                throw new Error(`L'obtention du quiz a échoué. Status: ${result.status}`);
            }

            return result.data.data as QuizType;

        } catch (error) {
            console.log("Error details: ", error);

            if (axios.isAxiosError(error)) {
                const err = error as AxiosError;
                const data = err.response?.data as { error: string } | undefined;
                return data?.error || 'Erreur serveur inconnue lors de la requête.';
            }

            return `Une erreur inattendue s'est produite.`
        }
    }

    /**
     * @returns true if successful 
     * @returns A error string if unsuccessful,
     */
    public async deleteQuiz(quizId: string): Promise<any> {
        try {

            if (!quizId) {
                throw new Error(`Le quizId est requis.`);
            }

            const url: string = this.constructRequestUrl(`/quiz/delete/${quizId}`);
            const headers = this.constructRequestHeaders();

            const result: AxiosResponse = await axios.delete(url, { headers: headers });

            if (result.status !== 200) {
                throw new Error(`La supression du quiz a échoué. Status: ${result.status}`);
            }

            return true;

        } catch (error) {
            console.log("Error details: ", error);

            if (axios.isAxiosError(error)) {
                const err = error as AxiosError;
                const data = err.response?.data as { error: string } | undefined;
                return data?.error || 'Erreur serveur inconnue lors de la requête.';
            }

            return `Une erreur inattendue s'est produite.`
        }
    }

    /**
     * @returns true if successful 
     * @returns A error string if unsuccessful,
     */
    public async updateQuiz(quizId: string, newTitle: string, newContent: string[]): Promise<any> {
        try {

            if (!quizId || !newTitle || !newContent) {
                throw new Error(`Le quizId, titre et le contenu sont requis.`);
            }

            const url: string = this.constructRequestUrl(`/quiz/update`);
            const headers = this.constructRequestHeaders();
            const body = { quizId, newTitle, newContent };

            const result: AxiosResponse = await axios.put(url, body, { headers: headers });

            if (result.status !== 200) {
                throw new Error(`La mise à jours du quiz a échoué. Status: ${result.status}`);
            }

            return true;

        } catch (error) {
            console.log("Error details: ", error);

            if (axios.isAxiosError(error)) {
                const err = error as AxiosError;
                const data = err.response?.data as { error: string } | undefined;
                return data?.error || 'Erreur serveur inconnue lors de la requête.';
            }

            return `Une erreur inattendue s'est produite.`
        }
    }

    /**
     * @returns true if successful 
     * @returns A error string if unsuccessful,
     */
    public async moveQuiz(quizId: string, newFolderId: string): Promise<any> {
        try {

            if (!quizId || !newFolderId) {
                throw new Error(`Le quizId et le nouveau dossier sont requis.`);
            }

            const url: string = this.constructRequestUrl(`/quiz/move`);
            const headers = this.constructRequestHeaders();
            const body = { quizId, newFolderId };

            const result: AxiosResponse = await axios.post(url, body, { headers: headers });

            if (result.status !== 200) {
                throw new Error(`Le déplacement du quiz a échoué. Status: ${result.status}`);
            }

            return true;

        } catch (error) {
            console.log("Error details: ", error);

            if (axios.isAxiosError(error)) {
                const err = error as AxiosError;
                const data = err.response?.data as { error: string } | undefined;
                return data?.error || 'Erreur serveur inconnue lors de la requête.';
            }

            return `Une erreur inattendue s'est produite.`
        }
    }

    /**
     * @remarks This function is not yet implemented.
     * @returns true if successful 
     * @returns A error string if unsuccessful,
     */
    public async duplicateQuiz(quizId: string): Promise<any> {


        const url: string = this.constructRequestUrl(`/quiz/duplicate`);
        const headers = this.constructRequestHeaders();
        const body = { quizId };
        
        try {
            const result: AxiosResponse = await axios.post(url, body, { headers });

            if (result.status !== 200) {
                throw new Error(`La duplication du quiz a échoué. Status: ${result.status}`);
            }

            return result;
        } catch (error) {
            console.error("Error details: ", error);

            if (axios.isAxiosError(error)) {
                const err = error as AxiosError;
                const data = err.response?.data as { error: string } | undefined;
                return data?.error || 'Erreur serveur inconnue lors de la requête.';
            }

            return `Une erreur inattendue s'est produite.`;
        }

    }

    /**
     * @remarks This function is not yet implemented.
     * @returns true if successful 
     * @returns A error string if unsuccessful,
     */
    public async copyQuiz(quizId: string, newTitle: string, folderId: string): Promise<any> {
        try {
            console.log(quizId, newTitle), folderId;
            return "Route not implemented yet!";

        } catch (error) {
            console.log("Error details: ", error);

            if (axios.isAxiosError(error)) {
                const err = error as AxiosError;
                const data = err.response?.data as { error: string } | undefined;
                return data?.error || 'Erreur serveur inconnue lors de la requête.';
            }

            return `Une erreur inattendue s'est produite.`
        }
    }

    // Images Route

    /**
     * @returns the image URL (string) if successful 
     * @returns A error string if unsuccessful,
     */
    public async uploadImage(image: File): Promise<string> {
        try {

            if (!image) {
                throw new Error(`L'image est requise.`);
            }

            const url: string = this.constructRequestUrl(`/image/upload`);

            const headers = {
                Authorization: `Bearer ${this.getToken()}`,
                'Content-Type': 'multipart/form-data'
            };

            const formData = new FormData();
            formData.append('image', image);

            const result: AxiosResponse = await axios.post(url, formData, { headers: headers });

            if (result.status !== 200) {
                throw new Error(`L'enregistrement a échoué. Status: ${result.status}`);
            }

            const id = result.data.id;

            return this.constructRequestUrl('/image/get/' + id);

        } catch (error) {
            console.log("Error details: ", error);

            if (axios.isAxiosError(error)) {
                const err = error as AxiosError;
                const data = err.response?.data as { error: string } | undefined;
                return data?.error || 'Erreur serveur inconnue lors de la requête.';
            }

            return `Une erreur inattendue s'est produite.`
        }
    }
    // NOTE : Get Image pas necessaire

}

const apiService = new ApiService();
export default apiService;
